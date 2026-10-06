import { useEffect, useRef, useState } from "react";

// Browser speech-to-text. The recognizer is created once; `onResult` is read
// through a ref so it always sees the latest component state.
const useSpeechRecognition = ({ onResult, onError } = {}) => {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onResultRef.current = onResult;
    onErrorRef.current = onError;
  });

  const SpeechRecognition =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);
  const isSupported = Boolean(SpeechRecognition);

  useEffect(() => {
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResultRef.current?.(transcript);
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
      onErrorRef.current?.(event.error);
    };
    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    return () => recognition.abort();
  }, [SpeechRecognition]);

  const toggleRecording = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      onErrorRef.current?.("not-supported");
      return;
    }
    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      try {
        recognition.start();
        setIsRecording(true);
      } catch (error) {
        console.error("Speech recognition start error:", error);
        onErrorRef.current?.("start-failed");
      }
    }
  };

  return { isRecording, isSupported, toggleRecording };
};

export default useSpeechRecognition;
