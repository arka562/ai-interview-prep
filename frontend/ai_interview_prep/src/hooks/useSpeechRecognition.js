import { useEffect, useMemo, useRef, useState } from "react";

const getSpeechRecognition = () =>
  window.SpeechRecognition || window.webkitSpeechRecognition;

const useSpeechRecognition = ({ onTranscript } = {}) => {
  const recognitionRef = useRef(null);
  const [error, setError] = useState("");
  const [isListening, setIsListening] = useState(false);

  const isSupported = useMemo(() => Boolean(getSpeechRecognition()), []);

  useEffect(() => {
    if (!isSupported) return undefined;

    const SpeechRecognition = getSpeechRecognition();
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let transcript = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        transcript += event.results[index][0].transcript;
      }

      if (transcript.trim()) {
        onTranscript?.(transcript.trim());
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
  }, [isSupported, onTranscript]);

  const startListening = () => {
    if (!recognitionRef.current) {
      setError("Speech recognition is not supported in this browser");
      return;
    }

    setError("");
    recognitionRef.current.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
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
    isListening,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
  };
};

export default useSpeechRecognition;
