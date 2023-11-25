"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import Question from "../../components/Question";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

const Questionnaire = () => {
  const [questionsData, setQuestionsData] = useState([
    {
      id: "studyHabit",
      question: "Study Habits?",
      options: [
        { id: "With music" },
        { id: "Quiet" },
        { id: "Be Myself" },
        { id: "With Other people" },
      ],
      selectedOption: "",
    },
    {
      id: "socialSchedule",
      question: "Social Schedule?",
      options: [
        { id: "Party Animal" },
        { id: "Couch Potato" },
        { id: "Depend on my mood " },
      ],
      selectedOption: "",
    },
    {
      id: "roomTemperature",
      question: "Room temperature?",
      options: [
        { id: "Freezing" },
        { id: "Cold" },
        { id: "Warm" },
        { id: "Melting" },
      ],
      selectedOption: "",
    },
    {
      id: "sleepingSchedule",
      question: "Sleeping schedule?",
      options: [
        { id: "Night owl (After 12am)" },
        { id: "Early Bird (Before 12am)" },
        { id: "Depend on the day" },
      ],
      selectedOption: "",
    },
    {
      id: "cleaning",
      question: "Cleaning Habit?",
      options: [
        { id: "Neat freak" },
        { id: "Relatively neat" },
        { id: "Messy" },
      ],
      selectedOption: "",
    },
    {
      id: "petPreference",
      question: "Pet preference?",
      options: [
        { id: "Bird" },
        { id: "cat" },
        { id: "Dog" },
        { id: "any" },
      ],
      selectedOption: "",
    },
    {
      id: "musicLoud",
      question: "Music so Loud?",
      options: [
        { id: "Neighbours can hear" },
        { id: "Sometimes may hear" },
        { id: "No one is bothered" },
      ],
      selectedOption: "",
    },
    {
      id: "timeAtHome",
      question: "How much time do you spend at home?",
      options: [{ id: "Home body" }, { id: "Always out" }],
      selectedOption: "",
    },
    {
      id: "hostingVisitors",
      question: "How often do you host visitors?",
      options: [{ id: "Every week" }, { id: "Ocassionally" }, { id: "Never" }],
      selectedOption: "",
    },
    {
      id: "drinkingHabit",
      question: "Drinking habit?",
      options: [{ id: "Don`t care" }, { id: "Drinker" }, { id: "Non-drinker" }],
      selectedOption: "",
    },
    {
      id: "smokingHabit",
      question: "Smoking habit?",
      options: [{ id: "Don`t care" }, { id: "Smoker" }, { id: "Non-smoker" }],
      selectedOption: "",
    },
    {
      id: "occupation",
      question: " Occupation?",
      options: [
        { id: "Don`t care " },
        { id: "Student" },
        { id: "Entrepreneur" },
        { id: "Working professional" },
        { id: "Freelancer" },
      ],
      selectedOption: "",
    },
    {
      id: "language",
      question: "Language?",
      options: [
        { id: "English" },
        { id: "Yoruba" },
        { id: "Hausa" },
        { id: "Igbo" },
      ],
      selectedOption: "",
    },
    {
      id: "religion",
      question: "religion",
      options: [{ id: "Christian" }, { id: "Muslim" }, { id: "Any" }],
      selectedOption: "",
    },
    // Add more questions and options as needed
  ]);

  const [stage, setStage] = useState(0);
  const [formData, setFormData] = useState({});
  const [windowWidth, setWindowWidth] = useState(0);
  const [errors, setErrors] = useState({});

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const router = useRouter();

  const userToken =
    typeof window !== "undefined"
      ? window.localStorage.getItem("loggedIn_User")
      : false;

  const token = JSON.parse(userToken);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    // console.log("token", token.accessToken);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsSmallScreen(windowWidth <= 667);
  }, [windowWidth]);

  const currentQuestions = isSmallScreen
    ? questionsData.slice(stage * 4, stage * 4 + 4)
    : questionsData;

  const handleOptionChange = (questionId, optionId) => {
    setFormData((prevData) => ({ ...prevData, [questionId]: optionId }));

    // Update the selectedOption for the current question in questionsData
    setQuestionsData((prevData) =>
      prevData.map((question) =>
        question.id === questionId
          ? { ...question, selectedOption: optionId }
          : question
      )
    );
  };

  const handleNext = () => {
    const currentQuestions = questionsData.slice(stage * 4, stage * 4 + 4);
    const anyErrors = currentQuestions.some(
      (question) => !formData[question.id]
    );

    if (anyErrors) {
      // Set the showError property for each question with missing answers
      setQuestionsData((prevData) =>
        prevData.map((question) =>
          currentQuestions.some((q) => q.id === question.id)
            ? { ...question, showError: !question.selectedOption }
            : question
        )
      );

      setTimeout(() => {
        // Clear the showError property after a timeout
        setQuestionsData((prevData) =>
          prevData.map((question) =>
            currentQuestions.some((q) => q.id === question.id)
              ? { ...question, showError: false }
              : question
          )
        );
      }, 7000);
      return;
    }

    if (stage < Math.ceil(questionsData.length / 4) - 1) {
      setStage((prevStage) => prevStage + 1);
    }
  };

  const handleBack = () => {
    if (stage > 0) {
      setStage((prevStage) => prevStage - 1);
    }
    setQuestionsData((prevData) =>
      prevData.map((question) => ({ ...question, showError: false }))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const anyErrors = questionsData.some((question) => !formData[question.id]);

    if (anyErrors && isSmallScreen) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [questionsData[0].id]: true,
      }));
      setTimeout(
        () =>
          setErrors((prevErrors) => ({
            ...prevErrors,
            [questionsData[0].id]: false,
          })),
        7000
      );
      return;
    }

    if (!isSmallScreen) {
      const currentQuestions = questionsData;
      const anyErrors = currentQuestions.some(
        (question) => !formData[question.id]
      );

      if (anyErrors) {
        // Set the showError property for each question with missing answers
        setQuestionsData((prevData) =>
          prevData.map((question) =>
            currentQuestions.some((q) => q.id === question.id)
              ? { ...question, showError: !question.selectedOption }
              : question
          )
        );

        setTimeout(() => {
          // Clear the showError property after a timeout
          setQuestionsData((prevData) =>
            prevData.map((question) =>
              currentQuestions.some((q) => q.id === question.id)
                ? { ...question, showError: false }
                : question
            )
          );
        }, 7000);
        return;
      }
    }
    console.log(formData);

    try {
      const url =
        "https://resavation-service.onrender.com/api/v1/roommates/profile-preference";
      const accessToken = token.token;
      const postData = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      const response = await postData.json();
      alert(response.message);
      router.push("/");
      return response;
    } catch (err) {
      alert("Please log in to set preferences.");
    }

    // try {
    //   const response = await axios.post(
    //     "https://resavation-service.onrender.com/api/v1/roommates/profile-preference",
    //     formData,
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `${token.accessToken}`,
    //       },
    //     }
    //   );

    //   console.log("Profile preference uploaded:", response.data);
    //   // further actions after successful upload
    // } catch (error) {
    //   console.error("Error uploading profile preference:", error);
    //   // error handling as needed
    // }
  };

  return (
    <div className="px-4 md:px-8 font-montserrat ">
      <Link href="./">
        <h1 className="font-bold md:py-4 py-2 md:text-2xl text-xl ">
          Profile Preference
        </h1>
      </Link>
      <form onSubmit={handleSubmit}>
        {isSmallScreen && (
          <h2 className="text-center my-4 font-bold">{`Step ${
            stage + 1
          }-${Math.ceil(questionsData.length / 4)} `}</h2>
        )}
        {currentQuestions.map((question) => (
          <div key={question.id}>
            <Question
              question={question.question}
              options={question.options}
              onChange={(optionId) => handleOptionChange(question.id, optionId)}
              selectedOption={question.selectedOption}
              showError={question.showError}
            />
          </div>
        ))}
        {isSmallScreen && (
          <div className="flex justify-center mt-4">
            {stage > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="mr-2 bg-[#074ce5] text-lg font-semibold px-4 py-2 md:px-8 md:py-4 text-white rounded-lg"
              >
                Back
              </button>
            )}
            {stage < Math.ceil(questionsData.length / 4) - 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="ml-2 bg-[#074ce5] text-lg font-semibold px-4 py-2 md:px-8 md:py-4 text-white rounded-lg"
              >
                Next
              </button>
            )}
            {stage === Math.ceil(questionsData.length / 4) - 1 && (
              <button
                type="submit"
                className="ml-2 bg-[#074ce5] text-lg font-semibold px-4 py-2 md:px-8 md:py-4 text-white rounded-lg"
              >
                Submit
              </button>
            )}
          </div>
        )}
        {!isSmallScreen && (
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className=" bg-[#074ce5] text-lg font-semibold px-4 py-2 md:px-8 md:py-4 text-white rounded-lg"
            >
              Submit
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Questionnaire;
