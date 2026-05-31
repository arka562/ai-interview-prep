import { useEffect, useMemo, useRef, useState } from "react";

const getSpeechRecognition = () =>
  window.SpeechRecognition || window.webkitSpeechRecognition;

const useSpeechRecognition = () => {
  const recognitionRef = useRef(null);
  const startedAtRef = useRef(null);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [error, setError] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  const isSupported = useMemo(() => Boolean(getSpeechRecognition()), []);

  useEffect(() => {
    if (!isSupported) return undefined;

    const SpeechRecognition = getSpeechRecognition();
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let nextTranscript = "";

      for (let index = 0; index < event.results.length; index += 1) {
        nextTranscript += event.results[index][0].transcript;
      }

      if (nextTranscript.trim()) {
        setTranscript(nextTranscript.trim());
      }
    };

    recognition.onerror = (event) => {
      setError(event.error || "Speech recognition failed");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [isSupported]);

  useEffect(() => {
    if (!isListening) return undefined;

    const timer = setInterval(() => {
      if (!startedAtRef.current) return;

      setDurationSeconds(
        Math.floor((Date.now() - startedAtRef.current) / 1000)
      );
    }, 500);

    return () => clearInterval(timer);
  }, [isListening]);

  const startListening = () => {
    if (!recognitionRef.current) {
      setError("Speech recognition is not supported in this browser");
      return;
    }

    setError("");
    startedAtRef.current = Date.now();
    setDurationSeconds(0);
    recognitionRef.current.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    startedAtRef.current = null;
    setIsListening(false);
  };

  const clearTranscript = () => {
    setTranscript("");
    setError("");
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
      return;
    }

    startListening();
  };

  return {
    error,
    clearTranscript,
    durationSeconds,
    isListening,
    isSupported,
    startListening,
    stopListening,
    transcript,
    toggleListening,
  };
};

export default useSpeechRecognition;
