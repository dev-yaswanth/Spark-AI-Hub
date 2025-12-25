import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TypewriterFeaturesProps {
    features: string[];
}

export function TypewriterFeatures({ features }: TypewriterFeaturesProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [speed, setSpeed] = useState(10); // Super fast speed

    useEffect(() => {
        const handleTyping = () => {
            // Clean feature text (remove existing | if present in string)
            const rawText = features[currentIndex] || "";
            const fullText = rawText.startsWith("|") ? rawText.substring(1).trim() : rawText.trim();

            if (!isDeleting) {
                setDisplayText(fullText.substring(0, displayText.length + 1));
                setSpeed(40); // Fast typing speed

                if (displayText === fullText) {
                    setTimeout(() => setIsDeleting(true), 1500); // Pause before delete
                }
            } else {
                setDisplayText(fullText.substring(0, displayText.length - 1));
                setSpeed(20); // Even faster deleting speed

                if (displayText === "") {
                    setIsDeleting(false);
                    setCurrentIndex((prev) => (prev + 1) % features.length);
                }
            }
        };

        const timer = setTimeout(handleTyping, speed);
        return () => clearTimeout(timer);
    }, [displayText, isDeleting, currentIndex, features, speed]);

    return (
        <div className="flex items-center gap-1 text-base md:text-lg font-medium text-primary py-1 min-h-[32px]">
            <span className="font-mono text-primary font-bold">|</span>
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-mono tracking-tight"
            >
                {displayText}
            </motion.span>
        </div>
    );
}
