"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Trophy, ArrowRight, RefreshCcw, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

export interface Question {
    question: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
}

export interface QuizUnit {
    title: string;
    questions: Question[];
}

interface InteractiveQuizProps {
    quizTitle: string;
    quizDescription: string;
    quizUnits: QuizUnit[];
    onCompleteMessage?: (score: number, total: number) => string;
}

export function InteractiveQuiz({
    quizTitle,
    quizDescription,
    quizUnits,
    onCompleteMessage
}: InteractiveQuizProps) {
    const [currentUnitIndex, setCurrentUnitIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);

    // Calculate total questions safely
    const totalQuestions = quizUnits.reduce((acc, unit) => acc + unit.questions.length, 0);

    // Safety check for empty quiz
    if (!quizUnits || quizUnits.length === 0) return null;

    const currentUnit = quizUnits[currentUnitIndex];
    if (!currentUnit || !currentUnit.questions) return null;

    const currentQuestion = currentUnit.questions[currentQuestionIndex];
    if (!currentQuestion) return null;

    // Calculate progress
    let questionsBeforeCurrentUnit = 0;
    for (let i = 0; i < currentUnitIndex; i++) {
        questionsBeforeCurrentUnit += quizUnits[i].questions.length;
    }
    const currentAbsoluteIndex = questionsBeforeCurrentUnit + currentQuestionIndex + 1;
    const totalProgress = (currentAbsoluteIndex / totalQuestions) * 100;

    const handleOptionSelect = (index: number) => {
        if (isAnswered) return;
        setSelectedOption(index);
    };

    const handleCheckAnswer = () => {
        if (selectedOption === null) return;
        setIsAnswered(true);
        if (selectedOption === currentQuestion.correctIndex) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < currentUnit.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            resetQuestionState();
        } else if (currentUnitIndex < quizUnits.length - 1) {
            setCurrentUnitIndex(prev => prev + 1);
            setCurrentQuestionIndex(0);
            resetQuestionState();
        } else {
            setQuizCompleted(true);
        }
    };

    const resetQuestionState = () => {
        setSelectedOption(null);
        setIsAnswered(false);
    };

    const restartQuiz = () => {
        setCurrentUnitIndex(0);
        setCurrentQuestionIndex(0);
        setScore(0);
        setQuizCompleted(false);
        setQuizStarted(true);
        resetQuestionState();
    };

    const getDefaultCompleteMessage = (score: number, total: number) => {
        const percentage = (score / total) * 100;
        if (percentage > 90) return "Exceptional mastery! You've successfully conquered all core concepts.";
        if (percentage > 70) return "Great job! You have a solid understanding of the material.";
        return "Good attempt! Review the course material to sharpen your expertise.";
    };

    if (!quizStarted) {
        return (
            <Card className="w-full max-w-2xl mx-auto overflow-hidden border-border bg-card shadow-2xl">
                <CardHeader className="text-center pt-12 pb-8">
                    <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Trophy className="w-10 h-10 text-primary-600" />
                    </div>
                    <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
                        {quizTitle}
                    </CardTitle>
                    <CardDescription className="text-lg mt-2 px-4 text-muted-foreground">
                        {quizDescription}
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-12">
                    <div className="grid grid-cols-1 gap-3 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {quizUnits.map((unit, idx) => (
                            <div key={idx} className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-primary-500/20">
                                <BookOpen className="w-5 h-5 text-primary-400 flex-shrink-0" />
                                <span className="text-sm font-medium text-foreground line-clamp-1">{unit.title}</span>
                            </div>
                        ))}
                    </div>
                    <Button
                        onClick={() => setQuizStarted(true)}
                        className="w-full h-14 text-lg font-semibold rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Start Final Assessment
                    </Button>
                </CardContent>
            </Card>
        )
    }

    if (quizCompleted) {
        return (
            <Card className="w-full max-w-2xl mx-auto overflow-hidden border-border bg-card shadow-2xl">
                <CardHeader className="text-center pt-12 pb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <Trophy className="w-12 h-12 text-yellow-600" />
                    </motion.div>
                    <CardTitle className="text-3xl font-bold">Quiz Completed!</CardTitle>
                    <CardDescription className="text-lg mt-2">
                        {onCompleteMessage ? onCompleteMessage(score, totalQuestions) : getDefaultCompleteMessage(score, totalQuestions)}
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-12 text-center">
                    <div className="text-6xl font-bold text-primary-600 mb-2">{score}/{totalQuestions}</div>
                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <Button
                            variant="outline"
                            onClick={restartQuiz}
                            className="flex-1 h-12 rounded-xl"
                        >
                            <RefreshCcw className="w-4 h-4 mr-2" />
                            Retake Quiz
                        </Button>
                        <Button
                            onClick={() => window.location.href = '#curriculum'}
                            className="flex-1 h-12 rounded-xl"
                        >
                            Review Course
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="w-full max-w-3xl mx-auto space-y-6">
            <div className="space-y-2">
                <div className="flex justify-between items-end">
                    <div className="max-w-[70%]">
                        <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest block mb-1">{currentUnit.title}</span>
                        <h3 className="text-xs text-text-secondary">Question {currentQuestionIndex + 1} of {currentUnit.questions.length}</h3>
                    </div>
                    <span className="text-sm font-bold bg-primary-100 text-primary-700 px-3 py-1 rounded-full">{Math.round(totalProgress)}% Complete</span>
                </div>
                <Progress value={totalProgress} className="h-2 rounded-full" />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={`${currentUnitIndex}-${currentQuestionIndex}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card className="border-none shadow-xl overflow-hidden">
                        <CardHeader className="bg-card/50 border-b border-border">
                            <CardTitle className="text-xl md:text-2xl leading-relaxed text-foreground">
                                {currentQuestion.question}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid gap-3">
                                {currentQuestion.options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        disabled={isAnswered}
                                        onClick={() => handleOptionSelect(idx)}
                                        className={cn(
                                            "group flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all duration-200",
                                            !isAnswered && selectedOption === idx && "border-primary-500 bg-primary-500/10",
                                            !isAnswered && selectedOption !== idx && "border-border hover:border-primary-500/50 hover:bg-slate-500/5",
                                            isAnswered && idx === currentQuestion.correctIndex && "border-green-500 bg-green-500/10",
                                            isAnswered && selectedOption === idx && idx !== currentQuestion.correctIndex && "border-red-500 bg-red-500/10",
                                            isAnswered && idx !== currentQuestion.correctIndex && selectedOption !== idx && "opacity-50 border-border"
                                        )}
                                    >
                                        <span className={cn(
                                            "font-medium",
                                            isAnswered && idx === currentQuestion.correctIndex && "text-green-700",
                                            isAnswered && selectedOption === idx && idx !== currentQuestion.correctIndex && "text-red-700"
                                        )}>
                                            {option}
                                        </span>
                                        <div className="flex items-center ml-4 flex-shrink-0">
                                            {isAnswered && idx === currentQuestion.correctIndex && (
                                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                                            )}
                                            {isAnswered && selectedOption === idx && idx !== currentQuestion.correctIndex && (
                                                <XCircle className="w-6 h-6 text-red-500" />
                                            )}
                                            {!isAnswered && (
                                                <div className={cn(
                                                    "w-6 h-6 rounded-full border-2 transition-colors",
                                                    selectedOption === idx ? "border-primary-500 bg-primary-500" : "border-slate-200 group-hover:border-primary-300"
                                                )} />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {isAnswered && currentQuestion.explanation && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-100 text-blue-800 text-sm"
                                >
                                    <div className="flex items-center mb-1 font-bold">
                                        <BookOpen className="w-4 h-4 mr-2" />
                                        Explanation
                                    </div>
                                    {currentQuestion.explanation}
                                </motion.div>
                            )}

                            <div className="mt-8 flex justify-end">
                                {!isAnswered ? (
                                    <Button
                                        disabled={selectedOption === null}
                                        onClick={handleCheckAnswer}
                                        className="px-8 h-12 rounded-xl"
                                    >
                                        Check Answer
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleNext}
                                        className="px-8 h-12 rounded-xl"
                                    >
                                        {currentAbsoluteIndex === totalQuestions
                                            ? "Finish Quiz"
                                            : "Next Question"}
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
