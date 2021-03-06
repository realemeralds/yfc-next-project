import { useCallback, useEffect, useRef, useState } from "react";

export const ChangingText = ({ progress }) => {
  const paraRef = useRef(null);
  const text = `Everyday tasks are excruciatingly frustrating, with text being
    substituted, reversed, inserted, omitted and even combined, 
    at the same time. Even dyslexics who
    can read decently well may experience severe headaches minutes into
    reading.`;
  let displayedWords = text.split(/\s+/);
  let originalWords = text.split(/\s+/);
  let changeCheck = [];
  let running = 0;
  let dict = "qwertyuiopasdfghjklzxcvbnm";
  let para;
  const [paused, setPaused] = useState(true);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    for (var i = 0; i < displayedWords.length; i++) {
      changeCheck.push(false);
    }
    messUpWords();
  }, []);

  useEffect(() => {
    if (progress > 0.3 && paused) {
      setTimeout(() => setPaused(false), 1500);
    } else if (progress < 0 || progress > 1) {
      resetWords();
      setPaused(true);
    }
  }, [progress]);

  useEffect(() => {
    if (!paused) messUpWords();
  }, [changed]); // might be a problem

  useEffect(() => {
    if (!paused) messUpWords();
  }, [paused]);

  function messUpWord(p, index, mode = getRandomInt(5) + 1) {
    if (changeCheck.includes(index)) {
      displayedWords[index] = originalWords[index];
      changeCheck.splice(changeCheck.indexOf(index), 1);
      p.innerHTML = displayedWords.join(" ");
      return;
    }

    let displayedWord = displayedWords[index];
    if (!displayedWord) {
      return;
    }
    let punctuation = "";
    if (changeCheck.includes(index)) {
      displayedWord = originalWords[index];
      return;
    }
    if (displayedWord.includes(",")) {
      punctuation = ",";
    } else if (displayedWord.includes(".")) {
      punctuation = ".";
    }
    let randomChar = dict.charAt(getRandomInt(26));
    if (mode === 1 || mode === 2 || mode === 3) {
      // substitution (1) or omission (2) or insertion (3)
      let randomIndex = getRandomInt(displayedWord.length - 1) + 1; // keep the front
      let before = displayedWord.slice(0, randomIndex);
      let after = displayedWord.slice(randomIndex + 1);
      if (mode === 3) {
        after = displayedWord.slice(randomIndex);
      }
      mode === 2
        ? (displayedWord =
            before +
            after.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, "") +
            punctuation)
        : (displayedWord =
            before +
            randomChar +
            after.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, "") +
            punctuation);
    } else if (mode === 4) {
      displayedWord =
        displayedWord
          .split("")
          .reverse()
          .join("")
          .replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, "") + punctuation;
    } else if (mode === 5) {
      let wordArray = displayedWord.split("");
      let randomIndex = getRandomInt(displayedWord.length - 2) + 1;
      let temp = wordArray[randomIndex + 1];
      wordArray[randomIndex + 1] = wordArray[randomIndex];
      wordArray[randomIndex] = temp;
      displayedWord =
        wordArray.join("").replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, "") +
        punctuation;
    }
    displayedWords[index] = displayedWord;
    p.innerHTML = displayedWords.join(" ");
    changeCheck.push(index);
  }

  function messUpWords() {
    if (!paraRef.current || paused) return;
    para = paraRef.current;
    if (para) {
      if (running > 1) {
        return;
      }
      for (var i = 0; i < displayedWords.length; i++) {
        if (Math.random() < 0.1) messUpWord(para, i);
      }
    }
    setTimeout(() => setChanged(!changed), 1000);
  }

  function resetWords() {
    if (!paraRef.current) return;
    para = paraRef.current;
    displayedWords = originalWords;
    para.innerHTML = displayedWords.join(" ");
    changeCheck = [];
    setPaused(true);
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  return (
    <div className="space-y-4 mt-10">
      <div className="p-7 bg-thirdAccent flex justify-center items-center flex-col rounded-3xl z-[3000] cv:mx-20">
        <p
          ref={paraRef}
          className="lg:text-3xl twoxsm:text-2xl project:font-medium text-xl font-regular tracking-tight leading-tight"
        >
          Everyday tasks are excruciatingly frustrating, with text being
          substituted, reversed, inserted, omitted and even combined, at the
          same time. Even dyslexics who can read decently well may experience
          severe headaches minutes into reading.
        </p>
      </div>
      <div className="space-x-4 flex justify-center align-center z-[2999]">
        <button
          onClick={() => {
            setPaused(!paused);
          }}
          className="bg-secondary text-white project:text-xl text-lg font-medium project:px-5 px-2 project:py-3 py-1 rounded-3xl"
        >
          PAUSE
        </button>
        <button
          onClick={() => {
            resetWords();
            setTimeout(() => setPaused(false), 1000);
          }}
          className="bg-secondary text-white project:text-xl text-lg font-medium project:px-5 px-2 project:py-3 py-1 rounded-3xl"
        >
          RESET
        </button>
      </div>
    </div>
  );
};
