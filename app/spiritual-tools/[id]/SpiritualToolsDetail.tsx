"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function SpiritualToolsDetail() {
  const router = useRouter();

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="p-6"
      >
        <h1 className="text-2xl font-bold">Spiritual Tool Details</h1>
        <p className="mt-2 text-gray-300">
          This page will display the details for the selected spiritual tool.
        </p>
      </motion.div>

      <AnimatePresence />
    </>
  );
}
