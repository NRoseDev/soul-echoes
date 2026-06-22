import { useState, useCallback, useEffect } from "react";
import { EncryptionEngine } from "@/services/security/EncryptionEngine";
import { useAuth } from "@/contexts/AuthContext";
import { EncryptedPayload } from "@/types/encryption";

export const useEncryptedStorage = (masterPassword?: string) => {
  const { user } = useAuth();
  const [derivedKey, setDerivedKey] = useState<CryptoKey | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const engine = new EncryptionEngine();

  // Initialize encryption with master password
  useEffect(() => {
    const initializeEncryption = async () => {
      if (!user || !masterPassword) return;

      try {
        // Generate salt from user ID (deterministic)
        const salt = new TextEncoder().encode(user.id.substring(0, 16).padEnd(16, "0"));

        // Derive master key from password
        const key = await engine.deriveKey(masterPassword, salt);
        setDerivedKey(key);
        setIsInitialized(true);
      } catch (error) {
        console.error("Encryption initialization error:", error);
      }
    };

    initializeEncryption();
  }, [user, masterPassword, engine]);

  const encryptAndStore = useCallback(
    async (data: string, storageKey: string): Promise<EncryptedPayload | null> => {
      if (!derivedKey) {
        console.warn("Encryption not initialized");
        return null;
      }

      try {
        const encrypted = await engine.encryptData(data, derivedKey);

        // Store in IndexedDB
        const db = await openDatabase();
        const tx = db.transaction(["encrypted_data"], "readwrite");
        await new Promise((resolve, reject) => {
          const request = tx.objectStore("encrypted_data").put({
            key: storageKey,
            ...encrypted,
          });
          request.onsuccess = () => resolve(undefined);
          request.onerror = () => reject(request.error);
        });

        return encrypted;
      } catch (error) {
        console.error("Encryption storage error:", error);
        return null;
      }
    },
    [derivedKey, engine]
  );

  const retrieveAndDecrypt = useCallback(
    async (storageKey: string): Promise<string | null> => {
      if (!derivedKey) {
        console.warn("Encryption not initialized");
        return null;
      }

      try {
        const db = await openDatabase();
        const tx = db.transaction(["encrypted_data"], "readonly");
        const data = await new Promise<EncryptedPayload>((resolve, reject) => {
          const request = tx.objectStore("encrypted_data").get(storageKey);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });

        if (!data) return null;

        return engine.decryptData(data, derivedKey);
      } catch (error) {
        console.error("Decryption error:", error);
        return null;
      }
    },
    [derivedKey, engine]
  );

  const deleteEncrypted = useCallback(async (storageKey: string): Promise<void> => {
    try {
      const db = await openDatabase();
      const tx = db.transaction(["encrypted_data"], "readwrite");
      await new Promise<void>((resolve, reject) => {
        const request = tx.objectStore("encrypted_data").delete(storageKey);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error("Deletion error:", error);
    }
  }, []);

  const clearAllEncrypted = useCallback(async (): Promise<void> => {
    try {
      const db = await openDatabase();
      const tx = db.transaction(["encrypted_data"], "readwrite");
      await new Promise<void>((resolve, reject) => {
        const request = tx.objectStore("encrypted_data").clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error("Clear all error:", error);
    }
  }, []);

  return {
    isInitialized,
    encryptAndStore,
    retrieveAndDecrypt,
    deleteEncrypted,
    clearAllEncrypted,
  };
};

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("soulEchoes", 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("encrypted_data")) {
        db.createObjectStore("encrypted_data", { keyPath: "key" });
      }
    };
  });
}
