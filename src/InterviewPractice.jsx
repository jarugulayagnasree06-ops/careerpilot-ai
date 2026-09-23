import { useEffect, useMemo, useRef, useState } from "react";

const HISTORY_KEY = "careerPilotInterviewHistory";

/* =========================================================
   QUESTION BANK
========================================================= */

const questionBank = {
  "AI/ML Engineer": {
    Technical: [
      {
        question:
          "What is the difference between supervised and unsupervised learning?",
        keywords: ["supervised", "unsupervised", "label", "training", "data"],
      },
      {
        question: "What is overfitting and how can you reduce it?",
        keywords: [
          "overfitting",
          "training",
          "validation",
          "regularization",
          "data",
        ],
      },
      {
        question:
          "What is the difference between classification and regression?",
        keywords: ["classification", "regression", "categorical", "continuous"],
      },
      {
        question:
          "Why is feature scaling important for some machine learning algorithms?",
        keywords: [
          "feature",
          "scaling",
          "normalization",
          "standardization",
          "distance",
        ],
      },
      {
        question: "What is a confusion matrix?",
        keywords: [
          "confusion",
          "matrix",
          "true positive",
          "false positive",
          "accuracy",
        ],
      },
      {
        question: "Explain the basic idea behind gradient descent.",
        keywords: [
          "gradient",
          "descent",
          "loss",
          "learning rate",
          "optimization",
        ],
      },
      {
        question: "What is the difference between AI, ML and deep learning?",
        keywords: ["AI", "machine learning", "deep learning", "neural network"],
      },
      {
        question: "What is a neural network?",
        keywords: ["neural", "network", "layers", "neurons", "weights"],
      },
    ],
    Behavioral: [
      {
        question: "Tell me about a machine learning project you have worked on.",
        keywords: ["project", "dataset", "model", "result", "learning"],
      },
      {
        question:
          "How would you approach a machine learning problem from scratch?",
        keywords: ["problem", "data", "cleaning", "features", "model", "evaluate"],
      },
      {
        question: "How do you handle a dataset with missing values?",
        keywords: ["missing", "values", "mean", "median", "remove", "impute"],
      },
    ],
    HR: [
      {
        question: "Why do you want to become an AI/ML Engineer?",
        keywords: ["AI", "machine learning", "interest", "technology", "career"],
      },
      {
        question: "Where do you see yourself in the next three years?",
        keywords: ["career", "skills", "experience", "growth", "AI"],
      },
    ],
  },

  "Software Developer": {
    Technical: [
      {
        question: "What is the difference between an array and a linked list?",
        keywords: ["array", "linked list", "memory", "index", "node"],
      },
      {
        question: "What is object-oriented programming?",
        keywords: [
          "object",
          "class",
          "inheritance",
          "polymorphism",
          "encapsulation",
        ],
      },
      {
        question: "What is the difference between SQL and NoSQL databases?",
        keywords: ["SQL", "NoSQL", "database", "relational", "document"],
      },
      {
        question: "What is a REST API?",
        keywords: ["REST", "API", "HTTP", "GET", "POST", "request"],
      },
      {
        question: "What is Git and why is it used?",
        keywords: ["Git", "version", "control", "repository", "commit"],
      },
      {
        question: "What is the difference between frontend and backend development?",
        keywords: ["frontend", "backend", "client", "server", "API"],
      },
    ],
    Behavioral: [
      {
        question: "Tell me about a software project you have built.",
        keywords: ["project", "technology", "development", "result"],
      },
      {
        question: "How do you debug a software application?",
        keywords: ["debug", "error", "console", "test", "problem"],
      },
      {
        question: "How do you learn a new programming language?",
        keywords: ["learn", "documentation", "practice", "project"],
      },
    ],
    HR: [
      {
        question: "Why do you want to become a software developer?",
        keywords: ["software", "development", "coding", "technology", "career"],
      },
      {
        question: "What are your strengths as a developer?",
        keywords: ["problem", "learning", "coding", "teamwork", "adapt"],
      },
    ],
  },

  "Data Analyst": {
    Technical: [
      {
        question: "What is the difference between SQL WHERE and HAVING?",
        keywords: ["SQL", "WHERE", "HAVING", "filter", "group"],
      },
      {
        question: "What is data cleaning?",
        keywords: ["data", "cleaning", "missing", "duplicate", "quality"],
      },
      {
        question: "What is the difference between mean, median and mode?",
        keywords: ["mean", "median", "mode", "average", "distribution"],
      },
      {
        question: "What is data visualization and why is it important?",
        keywords: ["visualization", "chart", "data", "insight", "decision"],
      },
      {
        question: "What is a KPI?",
        keywords: ["KPI", "metric", "performance", "business", "measure"],
      },
    ],
    Behavioral: [
      {
        question: "Tell me about a data analysis project you have completed.",
        keywords: ["data", "project", "analysis", "insight", "result"],
      },
      {
        question: "How would you handle inconsistent data?",
        keywords: ["data", "cleaning", "validation", "missing", "duplicate"],
      },
    ],
    HR: [
      {
        question: "Why are you interested in data analytics?",
        keywords: ["data", "analytics", "insight", "business", "career"],
      },
      {
        question: "What tools are you currently learning?",
        keywords: ["Python", "SQL", "Excel", "Power BI", "Tableau"],
      },
    ],
  },

  "Web Developer": {
    Technical: [
      {
        question: "What is HTML?",
        keywords: ["HTML", "structure", "web", "elements", "browser"],
      },
      {
        question: "What is CSS?",
        keywords: ["CSS", "style", "layout", "design", "web"],
      },
      {
        question: "What is JavaScript?",
        keywords: ["JavaScript", "web", "logic", "browser", "interactive"],
      },
      {
        question: "What is React?",
        keywords: ["React", "component", "JavaScript", "UI", "state"],
      },
      {
        question: "What is responsive web design?",
        keywords: ["responsive", "mobile", "desktop", "screen", "layout"],
      },
    ],
    Behavioral: [
      {
        question: "Tell me about a website you have built.",
        keywords: ["website", "project", "frontend", "design", "development"],
      },
      {
        question: "How do you make a website user friendly?",
        keywords: ["user", "design", "responsive", "navigation", "accessibility"],
      },
    ],
    HR: [
      {
        question: "Why do you want to work as a web developer?",
        keywords: ["web", "development", "frontend", "technology", "career"],
      },
      {
        question: "How do you keep improving your web development skills?",
        keywords: ["practice", "projects", "documentation", "learning"],
      },
    ],
  },

  "UI/UX Designer": {
    Technical: [
      {
        question: "What is the difference between UI and UX?",
        keywords: ["UI", "UX", "interface", "experience", "user"],
      },
      {
        question: "What is user research?",
        keywords: ["user", "research", "interview", "feedback", "problem"],
      },
      {
        question: "What is a wireframe?",
        keywords: ["wireframe", "layout", "design", "structure", "prototype"],
      },
      {
        question: "What is usability testing?",
        keywords: ["usability", "testing", "user", "feedback", "design"],
      },
    ],
    Behavioral: [
      {
        question: "Tell me about a UI/UX project you have worked on.",
        keywords: ["project", "design", "user", "research", "prototype"],
      },
      {
        question: "How do you handle feedback on your design?",
        keywords: ["feedback", "design", "user", "improve", "team"],
      },
    ],
    HR: [
      {
        question: "Why do you want to become a UI/UX designer?",
        keywords: ["design", "user", "creative", "experience", "career"],
      },
      {
        question: "What design tools are you familiar with?",
        keywords: ["Figma", "design", "prototype", "UI", "UX"],
      },
    ],
  },
};

const fallbackQuestions = [
  {
    question: "Tell me about yourself and your career goals.",
    keywords: ["experience", "skills", "career", "goal", "learning"],
  },
  {
    question: "What is the most important project you have worked on?",
    keywords: ["project", "technology", "role", "result", "learning"],
  },
  {
    question: "What technical skill are you currently improving?",
    keywords: ["skill", "learning", "practice", "project", "improve"],
  },
];

const roles = Object.keys(questionBank);

const difficulties = ["Easy", "Medium", "Hard"];

/* =========================================================
   HELPERS
========================================================= */

function loadHistory() {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // Ignore localStorage errors
  }
}

function getQuestions(role, count) {
  const roleBank = questionBank[role];

  if (!roleBank) {
    return fallbackQuestions.slice(0, count);
  }

  const allQuestions = [
    ...roleBank.Technical,
    ...roleBank.Behavioral,
    ...roleBank.HR,
  ];

  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);

  return shuffled.slice(0, Math.min(count, shuffled.length));
}

function analyzeAnswer(answer, question) {
  const cleanAnswer = answer.trim();

  if (!cleanAnswer) {
    return {
      score: 0,
      relevance: 0,
      communication: 0,
      technical: 0,
      matchedKeywords: [],
      missingKeywords: question.keywords || [],
      feedback:
        "No answer was detected. Try answering the question in your own words.",
    };
  }

  const lowerAnswer = cleanAnswer.toLowerCase();

  const matchedKeywords = (question.keywords || []).filter((keyword) =>
    lowerAnswer.includes(keyword.toLowerCase())
  );

  const missingKeywords = (question.keywords || []).filter(
    (keyword) => !lowerAnswer.includes(keyword.toLowerCase())
  );

  const keywordRatio =
    question.keywords?.length > 0
      ? matchedKeywords.length / question.keywords.length
      : 0;

  const wordCount = cleanAnswer.split(/\s+/).filter(Boolean).length;

  let score = 35 + Math.round(keywordRatio * 45);

  if (wordCount >= 20) {
    score += 10;
  }

  if (wordCount >= 50) {
    score += 5;
  }

  if (wordCount >= 80) {
    score += 5;
  }

  score = Math.min(score, 100);

  const relevance = Math.min(
    100,
    35 + Math.round(keywordRatio * 65)
  );

  const communication =
    wordCount < 10
      ? 35
      : wordCount < 20
      ? 55
      : wordCount < 50
      ? 75
      : 90;

  const technical = Math.min(
    100,
    30 + matchedKeywords.length * 12
  );

  let feedback = "";

  if (score >= 85) {
    feedback =
      "Strong answer. You covered the important concepts and communicated your idea clearly.";
  } else if (score >= 70) {
    feedback =
      "Good answer. Add one or two technical details or examples to make it stronger.";
  } else if (score >= 50) {
    feedback =
      "Your answer has some relevant points. Try explaining the concept more clearly and include key technical terms.";
  } else {
    feedback =
      "Try giving a more structured answer with a definition, explanation and example.";
  }

  return {
    score,
    relevance,
    communication,
    technical,
    matchedKeywords,
    missingKeywords,
    feedback,
  };
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");

  const secs = (seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${mins}:${secs}`;
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function InterviewPractice() {
  const [stage, setStage] = useState("setup");

  const [role, setRole] = useState("AI/ML Engineer");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionCount, setQuestionCount] = useState(4);

  const [mode, setMode] = useState("video");

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answer, setAnswer] = useState("");
  const [evaluations, setEvaluations] = useState([]);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);

  const [history, setHistory] = useState(loadHistory);

  /* Camera */
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoError, setVideoError] = useState("");

  /* Recording */
  const mediaRecorderRef = useRef(null);
  const recordingChunksRef = useRef([]);
  const recordingUrlsRef = useRef([]);

  const [isRecording, setIsRecording] = useState(false);
  const isRecordingRef = useRef(false);

  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const [recordings, setRecordings] = useState([]);

  /* Speech recognition */
  const recognitionRef = useRef(null);
  const speechTranscriptRef = useRef("");

  const [speechSupported, setSpeechSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");

  /* =========================================================
     SPEECH SUPPORT
  ========================================================= */

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    setSpeechSupported(Boolean(SpeechRecognition));
  }, []);

  /* =========================================================
     RECORDING TIMER
  ========================================================= */

  useEffect(() => {
    if (!isRecording) return;

    const timer = setInterval(() => {
      setRecordingSeconds((previous) => previous + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRecording]);

  /* =========================================================
     CAMERA START WHEN VIDEO INTERVIEW OPENS
  ========================================================= */

  useEffect(() => {
    if (stage !== "interview" || mode !== "video") {
      return;
    }

    const timer = setTimeout(() => {
      startCamera();
    }, 300);

    return () => clearTimeout(timer);
  }, [stage, mode]);

  /* =========================================================
     CAMERA CLEANUP
  ========================================================= */

  useEffect(() => {
    return () => {
      stopCamera();

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore
        }
      }

      recordingUrlsRef.current.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // Ignore
        }
      });
    };
  }, []);

  /* =========================================================
     START CAMERA
  ========================================================= */

  const startCamera = async () => {
    try {
      setVideoError("");

      if (!navigator.mediaDevices?.getUserMedia) {
        setVideoError(
          "Camera access is not supported by this browser."
        );
        return;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });

        streamRef.current = null;
      }

      let stream;

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: {
              ideal: 1280,
            },
            height: {
              ideal: 720,
            },
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
      } catch (firstError) {
        console.log(
          "Advanced camera settings failed. Trying basic camera.",
          firstError
        );

        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
      }

      streamRef.current = stream;

      setCameraReady(true);
      setCameraEnabled(true);
      setMicEnabled(true);
      setVideoError("");

      /*
       * IMPORTANT:
       * Wait until React has rendered the <video> element.
       */
      const attachVideo = async () => {
        if (!videoRef.current || !streamRef.current) {
          return;
        }

        videoRef.current.srcObject = streamRef.current;
        videoRef.current.muted = true;
        videoRef.current.autoplay = true;
        videoRef.current.playsInline = true;

        try {
          await videoRef.current.play();
        } catch (error) {
          console.log("Video play waiting:", error);

          setTimeout(async () => {
            if (videoRef.current && streamRef.current) {
              videoRef.current.srcObject = streamRef.current;

              try {
                await videoRef.current.play();
              } catch (retryError) {
                console.log(
                  "Video retry failed:",
                  retryError
                );
              }
            }
          }, 500);
        }
      };

      setTimeout(attachVideo, 100);
      setTimeout(attachVideo, 500);

      console.log("Camera started successfully.");
    } catch (error) {
      console.error("Camera error:", error);

      setCameraReady(false);

      if (error.name === "NotAllowedError") {
        setVideoError(
          "Camera or microphone permission was denied. Please allow access in your browser."
        );
      } else if (error.name === "NotFoundError") {
        setVideoError(
          "No camera or microphone was found on this device."
        );
      } else if (error.name === "NotReadableError") {
        setVideoError(
          "Your camera may already be in use by another application."
        );
      } else {
        setVideoError(
          "Unable to start the camera. Please try again."
        );
      }
    }
  };

  /* =========================================================
     STOP CAMERA
  ========================================================= */

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    setCameraReady(false);
  };

  /* =========================================================
     CAMERA TOGGLE
  ========================================================= */

  const toggleCamera = () => {
    if (!streamRef.current) return;

    const videoTracks = streamRef.current.getVideoTracks();

    if (!videoTracks.length) return;

    const newState = !cameraEnabled;

    videoTracks.forEach((track) => {
      track.enabled = newState;
    });

    setCameraEnabled(newState);
  };

  /* =========================================================
     MICROPHONE TOGGLE
  ========================================================= */

  const toggleMicrophone = () => {
    if (!streamRef.current) return;

    const audioTracks = streamRef.current.getAudioTracks();

    if (!audioTracks.length) return;

    const newState = !micEnabled;

    audioTracks.forEach((track) => {
      track.enabled = newState;
    });

    setMicEnabled(newState);
  };

  /* =========================================================
     START SPEECH RECOGNITION
  ========================================================= */

  const startSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore
        }
      }

      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let finalText = speechTranscriptRef.current;
        let interimText = "";

        for (
          let i = event.resultIndex;
          i < event.results.length;
          i++
        ) {
          const transcript =
            event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            finalText += `${transcript} `;
          } else {
            interimText += transcript;
          }
        }

        finalText = finalText.trim();

        speechTranscriptRef.current = finalText;

        setInterimTranscript(interimText);

        const combined = `${finalText} ${interimText}`.trim();

        if (combined) {
          setAnswer(combined);
        }
      };

      recognition.onerror = (event) => {
        console.log(
          "Speech recognition:",
          event.error
        );

        if (
          event.error !== "no-speech" &&
          event.error !== "aborted"
        ) {
          setVideoError(
            "Speech recognition stopped. You can type your answer manually."
          );
        }

        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);

        /*
         * Chrome sometimes stops recognition automatically.
         * Restart while recording.
         */
        if (isRecordingRef.current) {
          setTimeout(() => {
            if (isRecordingRef.current) {
              try {
                recognition.start();
              } catch {
                // Already running
              }
            }
          }, 300);
        }
      };

      recognitionRef.current = recognition;

      recognition.start();
    } catch (error) {
      console.log(
        "Speech recognition could not start:",
        error
      );
    }
  };

  /* =========================================================
     STOP SPEECH RECOGNITION
  ========================================================= */

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore
      }

      recognitionRef.current = null;
    }

    setIsListening(false);
    setInterimTranscript("");
  };

  /* =========================================================
     START RECORDING
  ========================================================= */

  const startRecording = () => {
    if (!streamRef.current) {
      setVideoError(
        "Camera is not ready. Please start the camera first."
      );
      return;
    }

    if (!window.MediaRecorder) {
      setVideoError(
        "Video recording is not supported by this browser."
      );
      return;
    }

    try {
      recordingChunksRef.current = [];

      speechTranscriptRef.current = "";

      setAnswer("");
      setInterimTranscript("");
      setCurrentEvaluation(null);
      setRecordingSeconds(0);
      setVideoError("");

      const supportedTypes = [
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm",
        "video/mp4",
      ];

      let mimeType = "";

      for (const type of supportedTypes) {
        if (
          MediaRecorder.isTypeSupported &&
          MediaRecorder.isTypeSupported(type)
        ) {
          mimeType = type;
          break;
        }
      }

      const recorder = mimeType
        ? new MediaRecorder(streamRef.current, {
            mimeType,
          })
        : new MediaRecorder(streamRef.current);

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordingChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const chunks = recordingChunksRef.current;

        if (!chunks.length) {
          setIsRecording(false);
          return;
        }

        const blob = new Blob(chunks, {
          type: recorder.mimeType || "video/webm",
        });

        const url = URL.createObjectURL(blob);

        recordingUrlsRef.current.push(url);

        const transcript = (
          speechTranscriptRef.current ||
          answer ||
          ""
        ).trim();

        setRecordings((previous) => [
          ...previous,
          {
            questionIndex: currentIndex,
            url,
            duration: recordingSeconds,
          },
        ]);

        /*
         * Automatically evaluate the spoken answer.
         */
        if (transcript && questions[currentIndex]) {
          const evaluation = analyzeAnswer(
            transcript,
            questions[currentIndex]
          );

          setAnswer(transcript);
          setCurrentEvaluation(evaluation);
        }

        recordingChunksRef.current = [];
      };

      recorder.onerror = (event) => {
        console.error(
          "MediaRecorder error:",
          event
        );

        setVideoError(
          "There was a problem recording your answer."
        );
      };

      recorder.start(250);

      isRecordingRef.current = true;

      setIsRecording(true);

      if (speechSupported && micEnabled) {
        startSpeechRecognition();
      }
    } catch (error) {
      console.error(
        "Recording could not start:",
        error
      );

      setVideoError(
        "Unable to start recording. Please try again."
      );
    }
  };

  /* =========================================================
     STOP RECORDING
  ========================================================= */

  const stopRecording = () => {
    isRecordingRef.current = false;

    stopSpeechRecognition();

    setIsRecording(false);

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  /* =========================================================
     CURRENT QUESTION
  ========================================================= */

  const currentQuestion = questions[currentIndex];

  /* =========================================================
     START INTERVIEW
  ========================================================= */

  const startInterview = () => {
    const selectedQuestions = getQuestions(
      role,
      questionCount
    );

    setQuestions(selectedQuestions);
    setCurrentIndex(0);
    setAnswer("");
    setCurrentEvaluation(null);
    setEvaluations([]);
    setRecordings([]);
    setVideoError("");
    setStage("interview");
  };

  /* =========================================================
     EVALUATE ANSWER
  ========================================================= */

  const evaluateCurrentAnswer = () => {
    if (!currentQuestion) return;

    const evaluation = analyzeAnswer(
      answer,
      currentQuestion
    );

    setCurrentEvaluation(evaluation);
  };

  /* =========================================================
     NEXT QUESTION
  ========================================================= */

  const nextQuestion = () => {
    if (!currentQuestion) return;

    const evaluation =
      currentEvaluation ||
      analyzeAnswer(answer, currentQuestion);

    const newEvaluation = {
      question: currentQuestion.question,
      answer: answer.trim(),
      ...evaluation,
    };

    const updatedEvaluations = [
      ...evaluations,
      newEvaluation,
    ];

    setEvaluations(updatedEvaluations);

    if (currentIndex + 1 >= questions.length) {
      finishInterview(updatedEvaluations);
      return;
    }

    setCurrentIndex((previous) => previous + 1);
    setAnswer("");
    setCurrentEvaluation(null);
    setInterimTranscript("");
    setRecordingSeconds(0);
  };

  /* =========================================================
     FINISH INTERVIEW
  ========================================================= */

  const finishInterview = (finalEvaluations) => {
    stopSpeechRecognition();

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // Ignore
      }
    }

    isRecordingRef.current = false;
    setIsRecording(false);

    stopCamera();

    const scores = finalEvaluations.map(
      (item) => item.score
    );

    const average =
      scores.length > 0
        ? Math.round(
            scores.reduce(
              (sum, score) => sum + score,
              0
            ) / scores.length
          )
        : 0;

    const historyItem = {
      id: Date.now(),
      role,
      difficulty,
      mode,
      questions: finalEvaluations.length,
      score: average,
      date: new Date().toLocaleDateString(),
    };

    const updatedHistory = [
      historyItem,
      ...history,
    ].slice(0, 10);

    setHistory(updatedHistory);
    saveHistory(updatedHistory);

    setStage("results");
  };

  /* =========================================================
     EXIT
  ========================================================= */

  const exitInterview = () => {
    stopRecording();

    stopCamera();

    setStage("setup");
    setQuestions([]);
    setCurrentIndex(0);
    setAnswer("");
    setEvaluations([]);
    setCurrentEvaluation(null);
    setRecordings([]);
    setVideoError("");
  };

  /* =========================================================
     PRACTICE AGAIN
  ========================================================= */

  const practiceAgain = () => {
    stopCamera();

    setQuestions([]);
    setCurrentIndex(0);
    setAnswer("");
    setEvaluations([]);
    setCurrentEvaluation(null);
    setRecordings([]);
    setVideoError("");
    setStage("setup");
  };

  /* =========================================================
     RECORDING FOR CURRENT QUESTION
  ========================================================= */

  const currentRecording = useMemo(() => {
    return recordings.find(
      (recording) =>
        recording.questionIndex === currentIndex
    );
  }, [recordings, currentIndex]);

  /* =========================================================
     SETUP SCREEN
  ========================================================= */

  if (stage === "setup") {
    return (
      <>
        <InterviewStyles />

        <div className="cp-interview-page">
          <div className="cp-interview-header">
            <div>
              <span className="cp-eyebrow">
                🎤 AI INTERVIEW PRACTICE
              </span>

              <h1>Practice like a real interview</h1>

              <p>
                Improve your technical, communication and
                interview confidence with CareerPilot.
              </p>
            </div>
          </div>

          <div className="cp-interview-setup">
            <div className="cp-setup-card">
              <div className="cp-card-icon">🎯</div>

              <h2>Choose your interview</h2>

              <label>Target role</label>

              <select
                value={role}
                onChange={(event) =>
                  setRole(event.target.value)
                }
              >
                {roles.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <label>Difficulty</label>

              <div className="cp-option-grid">
                {difficulties.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={
                      difficulty === item
                        ? "cp-option active"
                        : "cp-option"
                    }
                    onClick={() =>
                      setDifficulty(item)
                    }
                  >
                    {item === "Easy" && "🟢 "}
                    {item === "Medium" && "🟡 "}
                    {item === "Hard" && "🔴 "}
                    {item}
                  </button>
                ))}
              </div>

              <label>Number of questions</label>

              <div className="cp-option-grid">
                {[3, 4, 5, 8].map((number) => (
                  <button
                    key={number}
                    type="button"
                    className={
                      questionCount === number
                        ? "cp-option active"
                        : "cp-option"
                    }
                    onClick={() =>
                      setQuestionCount(number)
                    }
                  >
                    {number}
                  </button>
                ))}
              </div>
            </div>

            <div className="cp-setup-card">
              <div className="cp-card-icon">🤖</div>

              <h2>Interview mode</h2>

              <div className="cp-mode-grid">
                <button
                  type="button"
                  className={
                    mode === "text"
                      ? "cp-mode-card active"
                      : "cp-mode-card"
                  }
                  onClick={() => setMode("text")}
                >
                  <span className="cp-mode-icon">
                    ⌨️
                  </span>

                  <strong>Text Interview</strong>

                  <small>
                    Type your answers and receive
                    instant evaluation.
                  </small>
                </button>

                <button
                  type="button"
                  className={
                    mode === "video"
                      ? "cp-mode-card active"
                      : "cp-mode-card"
                  }
                  onClick={() => setMode("video")}
                >
                  <span className="cp-mode-icon">
                    🎥
                  </span>

                  <strong>Video Interview</strong>

                  <small>
                    Camera, microphone, recording and
                    speech transcript.
                  </small>
                </button>
              </div>

              {mode === "video" && (
                <div className="cp-privacy-box">
                  <span>🔒</span>

                  <div>
                    <strong>Your privacy</strong>

                    <p>
                      Camera and microphone are used in
                      your browser during the interview.
                      Recordings are not uploaded by this
                      component.
                    </p>
                  </div>
                </div>
              )}

              <button
                className="cp-primary-button"
                onClick={startInterview}
              >
                {mode === "video"
                  ? "🎥 Start Video Interview"
                  : "🚀 Start Interview"}
              </button>
            </div>
          </div>

          {history.length > 0 && (
            <div className="cp-history-section">
              <div className="cp-section-title">
                <div>
                  <span className="cp-eyebrow">
                    📊 YOUR PRACTICE
                  </span>

                  <h2>Recent interviews</h2>
                </div>
              </div>

              <div className="cp-history-grid">
                {history.slice(0, 5).map((item) => (
                  <div
                    className="cp-history-card"
                    key={item.id}
                  >
                    <div>
                      <strong>{item.role}</strong>

                      <span>
                        {item.mode === "video"
                          ? "🎥 Video"
                          : "⌨️ Text"}{" "}
                        • {item.difficulty}
                      </span>
                    </div>

                    <div className="cp-history-score">
                      {item.score}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  /* =========================================================
     RESULTS SCREEN
  ========================================================= */

  if (stage === "results") {
    const average =
      evaluations.length > 0
        ? Math.round(
            evaluations.reduce(
              (sum, item) => sum + item.score,
              0
            ) / evaluations.length
          )
        : 0;

    const strongest =
      evaluations.length > 0
        ? Math.max(
            ...evaluations.map(
              (item) => item.score
            )
          )
        : 0;

    return (
      <>
        <InterviewStyles />

        <div className="cp-interview-page">
          <div className="cp-results-hero">
            <span className="cp-eyebrow">
              🎉 INTERVIEW COMPLETE
            </span>

            <h1>Your interview results</h1>

            <p>
              {role} • {difficulty} •{" "}
              {mode === "video"
                ? "Video Interview"
                : "Text Interview"}
            </p>

            <div className="cp-score-circle">
              <strong>{average}</strong>
              <span>/100</span>
            </div>

            <h2>
              {average >= 85
                ? "Excellent work!"
                : average >= 70
                ? "Good performance!"
                : average >= 50
                ? "Keep improving!"
                : "More practice will help!"}
            </h2>
          </div>

          <div className="cp-result-stats">
            <div>
              <span>Questions</span>
              <strong>{evaluations.length}</strong>
            </div>

            <div>
              <span>Average score</span>
              <strong>{average}</strong>
            </div>

            <div>
              <span>Best answer</span>
              <strong>{strongest}</strong>
            </div>
          </div>

          <div className="cp-results-list">
            <div className="cp-results-heading">
              <h2>Question-by-question review</h2>

              <span>
                {mode === "video"
                  ? "🎥 Video responses"
                  : "⌨️ Text responses"}
              </span>
            </div>

            {evaluations.map((item, index) => {
              const recording = recordings.find(
                (record) =>
                  record.questionIndex === index
              );

              return (
                <div
                  className="cp-result-card"
                  key={index}
                >
                  <div className="cp-result-card-top">
                    <span>
                      QUESTION {index + 1}
                    </span>

                    <strong>
                      {item.score}/100
                    </strong>
                  </div>

                  <h3>{item.question}</h3>

                  <div className="cp-answer-box">
                    <span>Your answer</span>

                    <p>
                      {item.answer ||
                        "No answer recorded."}
                    </p>
                  </div>

                  <p className="cp-feedback">
                    💡 {item.feedback}
                  </p>

                  <div className="cp-metrics">
                    <EvaluationMetric
                      label="Relevance"
                      value={item.relevance}
                    />

                    <EvaluationMetric
                      label="Communication"
                      value={item.communication}
                    />

                    <EvaluationMetric
                      label="Technical"
                      value={item.technical}
                    />
                  </div>

                  {recording && (
                    <div className="cp-playback">
                      <div>
                        <strong>
                          🎥 Recorded answer
                        </strong>

                        <span>
                          {formatTime(
                            recording.duration
                          )}
                        </span>
                      </div>

                      <video
                        controls
                        src={recording.url}
                        className="cp-playback-video"
                      />
                    </div>
                  )}

                  {item.missingKeywords?.length >
                    0 && (
                    <div className="cp-keywords">
                      <span>Topics to improve:</span>

                      {item.missingKeywords.map(
                        (keyword) => (
                          <small key={keyword}>
                            {keyword}
                          </small>
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="cp-results-actions">
            <button
              className="cp-secondary-button"
              onClick={practiceAgain}
            >
              🔄 Practice Again
            </button>

            <button
              className="cp-primary-button"
              onClick={() => setStage("setup")}
            >
              🎯 New Interview
            </button>
          </div>
        </div>
      </>
    );
  }

  /* =========================================================
     INTERVIEW SCREEN
  ========================================================= */

  return (
    <>
      <InterviewStyles />

      <div className="cp-interview-page">
        <div className="cp-live-header">
          <div>
            <span className="cp-eyebrow">
              {mode === "video"
                ? "🎥 VIDEO INTERVIEW"
                : "⌨️ TEXT INTERVIEW"}
            </span>

            <h1>CareerPilot Interviewer</h1>

            <p>
              {role} • {difficulty}
            </p>
          </div>

          <button
            className="cp-exit-button"
            onClick={exitInterview}
          >
            Exit
          </button>
        </div>

        <div className="cp-progress">
          <div>
            <span>
              Question {currentIndex + 1} of{" "}
              {questions.length}
            </span>

            <strong>
              {Math.round(
                ((currentIndex + 1) /
                  questions.length) *
                  100
              )}
              %
            </strong>
          </div>

          <div className="cp-progress-track">
            <div
              style={{
                width: `${
                  ((currentIndex + 1) /
                    questions.length) *
                  100
                }%`,
              }}
            />
          </div>
        </div>

        {mode === "video" ? (
          <div className="cp-video-layout">
            <div className="cp-video-column">
              <div className="cp-video-card">
                <div className="cp-video-status">
                  <span>
                    <i
                      className={
                        cameraReady
                          ? "cp-status-dot live"
                          : "cp-status-dot"
                      }
                    />

                    {cameraReady
                      ? "Camera ready"
                      : "Camera not connected"}
                  </span>

                  {isRecording && (
                    <span className="cp-recording-status">
                      🔴 REC{" "}
                      {formatTime(recordingSeconds)}
                    </span>
                  )}
                </div>

                <div className="cp-video-frame">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="cp-live-video"
                  />

                  {!cameraReady && (
                    <div className="cp-video-placeholder">
                      <div>📷</div>

                      <strong>
                        Camera preview
                      </strong>

                      <span>
                        Click Retry Camera if the
                        preview does not appear.
                      </span>
                    </div>
                  )}

                  {!cameraEnabled &&
                    cameraReady && (
                      <div className="cp-camera-off">
                        📷
                        <span>Camera off</span>
                      </div>
                    )}

                  {isRecording && (
                    <div className="cp-recording-pill">
                      <span />
                      Recording
                    </div>
                  )}
                </div>

                {videoError && (
                  <div className="cp-video-error">
                    ⚠️ {videoError}
                  </div>
                )}

                <div className="cp-video-controls">
                  <button
                    type="button"
                    onClick={toggleCamera}
                    disabled={!cameraReady}
                  >
                    {cameraEnabled
                      ? "📷 Camera"
                      : "🚫 Camera"}
                  </button>

                  <button
                    type="button"
                    onClick={toggleMicrophone}
                    disabled={!cameraReady}
                  >
                    {micEnabled
                      ? "🎤 Mic"
                      : "🔇 Mic"}
                  </button>

                  {!isRecording ? (
                    <button
                      type="button"
                      className="cp-record-button"
                      onClick={startRecording}
                      disabled={!cameraReady}
                    >
                      🔴 Start Speaking
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="cp-stop-button"
                      onClick={stopRecording}
                    >
                      ⏹ Stop & Evaluate
                    </button>
                  )}
                </div>

                {!cameraReady && (
                  <button
                    type="button"
                    className="cp-retry-camera"
                    onClick={startCamera}
                  >
                    📷 Retry Camera
                  </button>
                )}

                <div className="cp-transcript-card">
                  <div className="cp-transcript-heading">
                    <div>
                      <strong>
                        📝 Answer transcript
                      </strong>

                      <span>
                        {isListening
                          ? "Listening..."
                          : speechSupported
                          ? "Speech recognition available"
                          : "Type your answer manually"}
                      </span>
                    </div>

                    {isListening && (
                      <span className="cp-listening">
                        ● LIVE
                      </span>
                    )}
                  </div>

                  <textarea
                    value={answer}
                    onChange={(event) =>
                      setAnswer(event.target.value)
                    }
                    placeholder={
                      speechSupported
                        ? "Your spoken answer will appear here..."
                        : "Type your answer here..."
                    }
                  />

                  {interimTranscript && (
                    <div className="cp-interim">
                      Hearing:{" "}
                      {interimTranscript}
                    </div>
                  )}

                  {!speechSupported && (
                    <small>
                      Your browser does not support
                      speech recognition. You can
                      still record your video and type
                      the transcript manually.
                    </small>
                  )}
                </div>

                {currentRecording && (
                  <div className="cp-current-recording">
                    <strong>
                      🎥 Answer recorded
                    </strong>

                    <video
                      controls
                      src={currentRecording.url}
                      className="cp-current-playback"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="cp-question-column">
              <div className="cp-interviewer-card">
                <div className="cp-interviewer-avatar">
                  🤖
                </div>

                <div>
                  <strong>
                    CareerPilot Interviewer
                  </strong>

                  <span>AI Interview Mode</span>
                </div>
              </div>

              <div className="cp-question-card">
                <span className="cp-question-number">
                  QUESTION {String(currentIndex + 1).padStart(2, "0")}
                </span>

                <h2>
                  {currentQuestion?.question}
                </h2>

                <p>
                  Take your time. Explain your answer
                  clearly and use an example when
                  possible.
                </p>
              </div>

              {currentEvaluation && (
                <div className="cp-evaluation-card">
                  <div className="cp-evaluation-score">
                    <div>
                      <span>Your score</span>
                      <strong>
                        {currentEvaluation.score}
                      </strong>
                    </div>

                    <div className="cp-score-mini">
                      /100
                    </div>
                  </div>

                  <p>
                    {currentEvaluation.feedback}
                  </p>

                  <div className="cp-metrics">
                    <EvaluationMetric
                      label="Relevance"
                      value={
                        currentEvaluation.relevance
                      }
                    />

                    <EvaluationMetric
                      label="Communication"
                      value={
                        currentEvaluation.communication
                      }
                    />

                    <EvaluationMetric
                      label="Technical"
                      value={
                        currentEvaluation.technical
                      }
                    />
                  </div>

                  {currentEvaluation.missingKeywords
                    ?.length > 0 && (
                    <div className="cp-keywords">
                      <span>
                        Consider mentioning:
                      </span>

                      {currentEvaluation.missingKeywords.map(
                        (keyword) => (
                          <small key={keyword}>
                            {keyword}
                          </small>
                        )
                      )}
                    </div>
                  )}
                </div>
              )}

              {!isRecording &&
                answer.trim() &&
                !currentEvaluation && (
                  <button
                    className="cp-evaluate-button"
                    onClick={evaluateCurrentAnswer}
                  >
                    ✨ Evaluate Answer
                  </button>
                )}

              {currentEvaluation && (
                <button
                  className="cp-next-button"
                  onClick={nextQuestion}
                >
                  {currentIndex + 1 >=
                  questions.length
                    ? "🏁 Finish Interview"
                    : "Next Question →"}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="cp-text-layout">
            <div className="cp-question-card large">
              <span className="cp-question-number">
                QUESTION {String(currentIndex + 1).padStart(
                  2,
                  "0"
                )}
              </span>

              <h2>
                {currentQuestion?.question}
              </h2>

              <p>
                Take your time. Explain your answer
                clearly and use an example when
                possible.
              </p>
            </div>

            <div className="cp-text-answer-card">
              <label>Your answer</label>

              <textarea
                value={answer}
                onChange={(event) =>
                  setAnswer(event.target.value)
                }
                placeholder="Type your answer here..."
              />

              {!currentEvaluation ? (
                <button
                  className="cp-primary-button"
                  onClick={evaluateCurrentAnswer}
                >
                  ✨ Evaluate Answer
                </button>
              ) : (
                <div className="cp-evaluation-card">
                  <div className="cp-evaluation-score">
                    <div>
                      <span>Your score</span>

                      <strong>
                        {currentEvaluation.score}
                      </strong>
                    </div>

                    <div className="cp-score-mini">
                      /100
                    </div>
                  </div>

                  <p>
                    {currentEvaluation.feedback}
                  </p>

                  <div className="cp-metrics">
                    <EvaluationMetric
                      label="Relevance"
                      value={
                        currentEvaluation.relevance
                      }
                    />

                    <EvaluationMetric
                      label="Communication"
                      value={
                        currentEvaluation.communication
                      }
                    />

                    <EvaluationMetric
                      label="Technical"
                      value={
                        currentEvaluation.technical
                      }
                    />
                  </div>

                  <button
                    className="cp-next-button"
                    onClick={nextQuestion}
                  >
                    {currentIndex + 1 >=
                    questions.length
                      ? "🏁 Finish Interview"
                      : "Next Question →"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* =========================================================
   EVALUATION METRIC
========================================================= */

function EvaluationMetric({ label, value }) {
  return (
    <div className="cp-metric">
      <div>
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>

      <div className="cp-metric-track">
        <div
          style={{
            width: `${value}%`,
          }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   SELF-CONTAINED STYLES
========================================================= */

function InterviewStyles() {
  return (
    <style>{`
      .cp-interview-page {
        min-height: 100%;
        padding: 34px;
        background: #f6f8fc;
        color: #172033;
        box-sizing: border-box;
      }

      .cp-interview-page * {
        box-sizing: border-box;
      }

      .cp-interview-header,
      .cp-live-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 20px;
        margin-bottom: 30px;
      }

      .cp-interview-header h1,
      .cp-live-header h1 {
        margin: 6px 0;
        font-size: 32px;
        line-height: 1.15;
        color: #172033;
      }

      .cp-interview-header p,
      .cp-live-header p {
        margin: 0;
        color: #6c7890;
        font-size: 15px;
      }

      .cp-eyebrow {
        display: inline-block;
        color: #2864dc;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 1.5px;
      }

      .cp-interview-setup {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 22px;
        max-width: 1100px;
      }

      .cp-setup-card,
      .cp-video-card,
      .cp-question-card,
      .cp-text-answer-card,
      .cp-history-section,
      .cp-result-card {
        background: white;
        border: 1px solid #e7ebf3;
        border-radius: 22px;
        box-shadow: 0 12px 35px rgba(29, 49, 87, 0.07);
      }

      .cp-setup-card {
        padding: 28px;
      }

      .cp-card-icon {
        width: 54px;
        height: 54px;
        display: grid;
        place-items: center;
        border-radius: 16px;
        background: #eef4ff;
        font-size: 26px;
        margin-bottom: 18px;
      }

      .cp-setup-card h2 {
        margin: 0 0 24px;
        font-size: 21px;
      }

      .cp-setup-card label {
        display: block;
        margin: 18px 0 8px;
        font-size: 13px;
        font-weight: 700;
        color: #536079;
      }

      .cp-setup-card select {
        width: 100%;
        border: 1px solid #dce2ed;
        border-radius: 12px;
        padding: 13px 14px;
        background: white;
        color: #172033;
        font-size: 14px;
        outline: none;
      }

      .cp-option-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
      }

      .cp-option {
        border: 1px solid #dce2ed;
        background: white;
        border-radius: 11px;
        padding: 11px 8px;
        cursor: pointer;
        font-weight: 700;
        color: #56627a;
      }

      .cp-option.active {
        border-color: #2864dc;
        background: #eef4ff;
        color: #2864dc;
      }

      .cp-mode-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .cp-mode-card {
        text-align: left;
        border: 1px solid #dfe5ef;
        background: white;
        border-radius: 17px;
        padding: 18px;
        cursor: pointer;
        transition: 0.2s;
      }

      .cp-mode-card:hover {
        transform: translateY(-2px);
        border-color: #b9ccef;
      }

      .cp-mode-card.active {
        border: 2px solid #2864dc;
        background: #f1f6ff;
      }

      .cp-mode-icon {
        display: block;
        font-size: 26px;
        margin-bottom: 10px;
      }

      .cp-mode-card strong {
        display: block;
        color: #172033;
        margin-bottom: 6px;
      }

      .cp-mode-card small {
        display: block;
        color: #748098;
        line-height: 1.5;
      }

      .cp-privacy-box {
        display: flex;
        gap: 12px;
        margin-top: 16px;
        padding: 14px;
        border-radius: 14px;
        background: #f5f8fd;
      }

      .cp-privacy-box p {
        margin: 5px 0 0;
        color: #738097;
        font-size: 12px;
        line-height: 1.5;
      }

      .cp-primary-button,
      .cp-next-button,
      .cp-evaluate-button {
        width: 100%;
        border: 0;
        border-radius: 13px;
        padding: 14px 18px;
        margin-top: 20px;
        background: #2864dc;
        color: white;
        font-weight: 800;
        cursor: pointer;
        font-size: 14px;
        box-shadow: 0 10px 20px rgba(40, 100, 220, 0.2);
      }

      .cp-primary-button:hover,
      .cp-next-button:hover,
      .cp-evaluate-button:hover {
        background: #1f54bf;
      }

      .cp-secondary-button {
        border: 1px solid #d9e0ec;
        background: white;
        color: #25324a;
        border-radius: 13px;
        padding: 13px 20px;
        font-weight: 800;
        cursor: pointer;
      }

      .cp-exit-button {
        border: 1px solid #d9e0ec;
        background: white;
        border-radius: 12px;
        padding: 10px 18px;
        color: #536079;
        font-weight: 700;
        cursor: pointer;
      }

      .cp-history-section {
        max-width: 1100px;
        margin-top: 25px;
        padding: 25px;
      }

      .cp-section-title h2 {
        margin: 5px 0 18px;
      }

      .cp-history-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
      }

      .cp-history-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px;
        border: 1px solid #e5e9f1;
        border-radius: 14px;
      }

      .cp-history-card strong,
      .cp-history-card span {
        display: block;
      }

      .cp-history-card span {
        margin-top: 5px;
        color: #78849b;
        font-size: 12px;
      }

      .cp-history-score {
        width: 43px;
        height: 43px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: #eef4ff;
        color: #2864dc;
        font-weight: 900;
      }

      .cp-progress {
        max-width: 1200px;
        margin-bottom: 20px;
      }

      .cp-progress > div:first-child {
        display: flex;
        justify-content: space-between;
        color: #647089;
        font-size: 13px;
        margin-bottom: 8px;
      }

      .cp-progress strong {
        color: #2864dc;
      }

      .cp-progress-track,
      .cp-metric-track {
        overflow: hidden;
        height: 7px;
        background: #e9edf4;
        border-radius: 20px;
      }

      .cp-progress-track > div,
      .cp-metric-track > div {
        height: 100%;
        background: #2864dc;
        border-radius: inherit;
        transition: width 0.3s ease;
      }

      .cp-video-layout {
        max-width: 1200px;
        display: grid;
        grid-template-columns: minmax(0, 1.35fr) minmax(340px, 0.75fr);
        gap: 20px;
        align-items: start;
      }

      .cp-video-card {
        padding: 18px;
      }

      .cp-video-status {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        font-size: 13px;
        font-weight: 800;
      }

      .cp-video-status > span:first-child {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .cp-status-dot {
        width: 9px;
        height: 9px;
        border-radius: 50%;
        display: inline-block;
        background: #aab3c3;
      }

      .cp-status-dot.live {
        background: #28b66b;
        box-shadow: 0 0 0 5px rgba(40, 182, 107, 0.12);
      }

      .cp-recording-status {
        color: #df3945;
      }

      .cp-video-frame {
        position: relative;
        width: 100%;
        min-height: 430px;
        overflow: hidden;
        border-radius: 18px;
        background: #081122;
      }

      .cp-live-video {
        display: block;
        width: 100%;
        height: 100%;
        min-height: 430px;
        object-fit: cover;
        background: #081122;
        transform: scaleX(-1);
      }

      .cp-video-placeholder {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
        color: white;
        text-align: center;
        background: #081122;
      }

      .cp-video-placeholder div {
        font-size: 48px;
      }

      .cp-video-placeholder span {
        color: #aeb9cb;
        font-size: 13px;
      }

      .cp-camera-off {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
        background: #081122;
        color: white;
        font-size: 38px;
      }

      .cp-camera-off span {
        font-size: 14px;
        color: #b4bfd1;
      }

      .cp-recording-pill {
        position: absolute;
        top: 16px;
        left: 16px;
        padding: 8px 11px;
        border-radius: 20px;
        background: rgba(8, 17, 34, 0.82);
        color: white;
        font-size: 12px;
        font-weight: 800;
      }

      .cp-recording-pill span {
        display: inline-block;
        width: 8px;
        height: 8px;
        margin-right: 6px;
        border-radius: 50%;
        background: #ff3947;
      }

      .cp-video-error {
        margin-top: 10px;
        padding: 10px 12px;
        border-radius: 10px;
        background: #fff2f2;
        color: #c8323d;
        font-size: 12px;
      }

      .cp-video-controls {
        display: grid;
        grid-template-columns: 1fr 1fr 1.7fr;
        gap: 9px;
        margin-top: 12px;
      }

      .cp-video-controls button {
        border: 1px solid #dce2ed;
        background: white;
        border-radius: 11px;
        padding: 12px 8px;
        font-weight: 700;
        cursor: pointer;
        color: #34415a;
      }

      .cp-video-controls button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .cp-video-controls .cp-record-button {
        border: 0;
        background: #2864dc;
        color: white;
      }

      .cp-video-controls .cp-stop-button {
        border: 0;
        background: #df3945;
        color: white;
      }

      .cp-retry-camera {
        width: 100%;
        border: 0;
        border-radius: 11px;
        margin-top: 9px;
        padding: 11px;
        background: #edf3ff;
        color: #2864dc;
        font-weight: 800;
        cursor: pointer;
      }

      .cp-transcript-card {
        margin-top: 14px;
        padding: 15px;
        border-radius: 15px;
        background: #f7f9fc;
        border: 1px solid #e5e9f1;
      }

      .cp-transcript-heading {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 9px;
      }

      .cp-transcript-heading strong,
      .cp-transcript-heading span {
        display: block;
      }

      .cp-transcript-heading span {
        color: #7c879b;
        font-size: 11px;
        margin-top: 4px;
      }

      .cp-listening {
        color: #df3945 !important;
        font-weight: 900;
      }

      .cp-transcript-card textarea {
        width: 100%;
        min-height: 110px;
        resize: vertical;
        border: 1px solid #dce2ed;
        border-radius: 11px;
        padding: 12px;
        outline: none;
        font-family: inherit;
        font-size: 13px;
        line-height: 1.55;
      }

      .cp-transcript-card small {
        display: block;
        margin-top: 8px;
        color: #7a869a;
        line-height: 1.5;
      }

      .cp-interim {
        margin-top: 7px;
        color: #2864dc;
        font-size: 12px;
      }

      .cp-current-recording {
        margin-top: 14px;
        padding: 15px;
        border-radius: 15px;
        background: #f7f9fc;
      }

      .cp-current-playback {
        display: block;
        width: 100%;
        max-height: 280px;
        margin-top: 10px;
        border-radius: 12px;
        background: #081122;
      }

      .cp-interviewer-card {
        display: flex;
        align-items: center;
        gap: 13px;
        padding: 4px 4px 17px;
      }

      .cp-interviewer-avatar {
        width: 52px;
        height: 52px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: #eaf0ff;
        font-size: 25px;
      }

      .cp-interviewer-card strong,
      .cp-interviewer-card span {
        display: block;
      }

      .cp-interviewer-card strong {
        font-size: 16px;
      }

      .cp-interviewer-card span {
        margin-top: 4px;
        color: #738097;
        font-size: 13px;
      }

      .cp-question-card {
        padding: 25px;
      }

      .cp-question-card.large {
        max-width: 1000px;
        margin-bottom: 18px;
      }

      .cp-question-number {
        color: #2864dc;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 1.3px;
      }

      .cp-question-card h2 {
        margin: 14px 0;
        font-size: 28px;
        line-height: 1.25;
      }

      .cp-question-card p {
        margin: 0;
        color: #748097;
        line-height: 1.7;
      }

      .cp-evaluation-card {
        margin-top: 15px;
        padding: 19px;
        border-radius: 17px;
        background: #f7f9fc;
        border: 1px solid #e5e9f1;
      }

      .cp-evaluation-score {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
      }

      .cp-evaluation-score span {
        display: block;
        color: #6f7c92;
        font-size: 12px;
      }

      .cp-evaluation-score strong {
        display: inline-block;
        margin-top: 3px;
        font-size: 34px;
        color: #2864dc;
      }

      .cp-score-mini {
        color: #8b95a7;
        font-size: 13px;
      }

      .cp-evaluation-card > p {
        color: #56627a;
        line-height: 1.6;
        font-size: 13px;
      }

      .cp-metrics {
        display: grid;
        gap: 10px;
      }

      .cp-metric > div:first-child {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
        font-size: 11px;
      }

      .cp-metric-track {
        height: 6px;
      }

      .cp-metric-track > div {
        background: #2864dc;
      }

      .cp-keywords {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 14px;
        align-items: center;
      }

      .cp-keywords span {
        font-size: 11px;
        color: #68758c;
      }

      .cp-keywords small {
        padding: 5px 8px;
        border-radius: 20px;
        background: #eaf0ff;
        color: #2864dc;
        font-size: 10px;
        font-weight: 700;
      }

      .cp-text-layout {
        max-width: 1000px;
      }

      .cp-text-answer-card {
        padding: 22px;
      }

      .cp-text-answer-card label {
        display: block;
        font-weight: 800;
        margin-bottom: 9px;
      }

      .cp-text-answer-card > textarea {
        width: 100%;
        min-height: 230px;
        resize: vertical;
        border: 1px solid #dce2ed;
        border-radius: 14px;
        padding: 15px;
        font-family: inherit;
        font-size: 14px;
        line-height: 1.6;
        outline: none;
      }

      .cp-results-hero {
        text-align: center;
        max-width: 850px;
        margin: 0 auto 25px;
        padding: 30px;
        background: white;
        border: 1px solid #e7ebf3;
        border-radius: 24px;
        box-shadow: 0 12px 35px rgba(29, 49, 87, 0.07);
      }

      .cp-results-hero h1 {
        margin: 8px 0;
        font-size: 32px;
      }

      .cp-results-hero p {
        margin: 0;
        color: #778298;
      }

      .cp-score-circle {
        width: 125px;
        height: 125px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 25px auto 15px;
        border-radius: 50%;
        border: 10px solid #eaf0ff;
        background: #f8faff;
      }

      .cp-score-circle strong {
        font-size: 34px;
        color: #2864dc;
      }

      .cp-score-circle span {
        color: #7b879c;
        font-size: 12px;
      }

      .cp-results-hero h2 {
        margin: 0;
      }

      .cp-result-stats {
        max-width: 850px;
        margin: 0 auto 25px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
      }

      .cp-result-stats > div {
        padding: 20px;
        background: white;
        border: 1px solid #e7ebf3;
        border-radius: 17px;
        text-align: center;
      }

      .cp-result-stats span,
      .cp-result-stats strong {
        display: block;
      }

      .cp-result-stats span {
        color: #78849a;
        font-size: 12px;
      }

      .cp-result-stats strong {
        margin-top: 6px;
        color: #2864dc;
        font-size: 25px;
      }

      .cp-results-list {
        max-width: 1000px;
        margin: 0 auto;
      }

      .cp-results-heading {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 14px;
      }

      .cp-results-heading h2 {
        margin: 0;
      }

      .cp-results-heading span {
        color: #778298;
        font-size: 12px;
      }

      .cp-result-card {
        padding: 22px;
        margin-bottom: 15px;
      }

      .cp-result-card-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .cp-result-card-top span {
        color: #2864dc;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 1px;
      }

      .cp-result-card-top strong {
        color: #2864dc;
      }

      .cp-result-card h3 {
        margin: 12px 0 15px;
        line-height: 1.4;
      }

      .cp-answer-box {
        padding: 13px;
        background: #f7f9fc;
        border-radius: 12px;
      }

      .cp-answer-box span {
        font-size: 11px;
        font-weight: 800;
        color: #6d7990;
      }

      .cp-answer-box p {
        margin: 7px 0 0;
        color: #4e5a72;
        line-height: 1.6;
        font-size: 13px;
      }

      .cp-feedback {
        padding: 12px;
        background: #eef4ff;
        color: #365582;
        border-radius: 11px;
        font-size: 13px;
        line-height: 1.5;
      }

      .cp-playback {
        margin-top: 15px;
        padding: 14px;
        background: #f7f9fc;
        border-radius: 13px;
      }

      .cp-playback > div {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
      }

      .cp-playback > div span {
        color: #78849a;
      }

      .cp-playback-video {
        display: block;
        width: 100%;
        max-height: 350px;
        margin-top: 10px;
        border-radius: 12px;
        background: #081122;
      }

      .cp-results-actions {
        max-width: 850px;
        margin: 25px auto;
        display: flex;
        justify-content: center;
        gap: 10px;
      }

      .cp-results-actions .cp-primary-button {
        width: auto;
        margin: 0;
      }

      @media (max-width: 900px) {
        .cp-interview-page {
          padding: 20px;
        }

        .cp-interview-setup,
        .cp-video-layout {
          grid-template-columns: 1fr;
        }

        .cp-video-frame,
        .cp-live-video {
          min-height: 360px;
        }
      }

      @media (max-width: 650px) {
        .cp-interview-header h1,
        .cp-live-header h1 {
          font-size: 25px;
        }

        .cp-option-grid,
        .cp-mode-grid,
        .cp-history-grid,
        .cp-result-stats {
          grid-template-columns: 1fr 1fr;
        }

        .cp-video-controls {
          grid-template-columns: 1fr 1fr;
        }

        .cp-video-controls .cp-record-button,
        .cp-video-controls .cp-stop-button {
          grid-column: 1 / -1;
        }

        .cp-video-frame,
        .cp-live-video {
          min-height: 280px;
        }

        .cp-question-card h2 {
          font-size: 23px;
        }

        .cp-results-actions {
          flex-direction: column;
        }

        .cp-results-actions .cp-primary-button {
          width: 100%;
        }
      }
    `}</style>
  );
}