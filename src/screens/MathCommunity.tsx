/**
 * MathLover CCC - Screen 5: Math Community
 * Mathematics question board for City Colleges of Chicago students.
 * Browse by subject, post questions with math symbol integration, and exchange peer replies.
 */

import React, { useState, useMemo } from 'react';
import { useMath } from '../context/MathContext';
import { CCC_CAMPUSES, MATH_COURSES } from '../data/mockData';
import { CommunityQuestion, MathCourse } from '../types';
import { MathSymbolPicker } from '../components/MathSymbolPicker';
import {
  MessageSquare,
  Plus,
  Search,
  ThumbsUp,
  MessageCircle,
  CheckCircle,
  MapPin,
  X,
  Send,
  Sparkles,
  HelpCircle,
  Tag,
  Clock,
  BookOpen
} from 'lucide-react';
import { BadgeDisplay } from '../components/BadgeDisplay';

const SUBJECT_CATEGORIES = [
  'All Subjects',
  'Precalculus',
  'Calculus',
  'Linear Algebra',
  'Statistics',
  'College Algebra',
  'Discrete Math',
];

export const MathCommunity: React.FC = () => {
  const { questions, addQuestion, addReply, toggleUpvoteQuestion, toggleUpvoteReply, userProfile, featuredBadge } = useMath();

  // Active Subject Filter
  const [selectedSubject, setSelectedSubject] = useState<string>('All Subjects');
  const [searchQuery, setSearchQuery] = useState('');

  // Ask Question Modal State
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState<'Precalculus' | 'Calculus' | 'Linear Algebra' | 'Statistics' | 'College Algebra' | 'Discrete Math'>('Precalculus');
  const [newCourse, setNewCourse] = useState<MathCourse>('Precalculus');
  const [newMathExpr, setNewMathExpr] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('Homework, Exam Prep');
  const [formError, setFormError] = useState<string | null>(null);

  // Active Question Thread Modal (to view details and post replies)
  const [activeThread, setActiveThread] = useState<CommunityQuestion | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyMathFormula, setReplyMathFormula] = useState('');

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // Subject filter
      if (selectedSubject !== 'All Subjects' && q.subject !== selectedSubject) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = q.title.toLowerCase().includes(query);
        const matchesContent = q.content.toLowerCase().includes(query);
        const matchesAuthor = q.authorName.toLowerCase().includes(query);
        const matchesTags = q.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesContent && !matchesAuthor && !matchesTags) {
          return false;
        }
      }
      return true;
    });
  }, [questions, selectedSubject, searchQuery]);

  // Keep active thread synchronized with questions context
  const currentThread = useMemo(() => {
    if (!activeThread) return null;
    return questions.find((q) => q.id === activeThread.id) || activeThread;
  }, [questions, activeThread]);

  // Insert symbol helper for new question formula
  const handleInsertQuestionSymbol = (symbol: string) => {
    setNewMathExpr((prev) => prev + symbol);
  };

  // Insert symbol helper for reply formula
  const handleInsertReplySymbol = (symbol: string) => {
    setReplyMathFormula((prev) => prev + symbol);
  };

  // Submit new question
  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newTitle.trim()) {
      setFormError('Please enter a question title.');
      return;
    }
    if (!newContent.trim()) {
      setFormError('Please explain the problem and where you need clarification.');
      return;
    }

    const tagsArray = newTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const res = addQuestion({
      title: newTitle.trim(),
      subject: newSubject,
      course: newCourse,
      content: newContent.trim(),
      mathExpression: newMathExpr.trim() || undefined,
      tags: tagsArray.length > 0 ? tagsArray : [newSubject],
    });

    if (res.success) {
      setIsAskModalOpen(false);
      setNewTitle('');
      setNewContent('');
      setNewMathExpr('');
    } else if (res.error) {
      setFormError(res.error);
    }
  };

  // Submit reply
  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentThread || !replyText.trim()) return;

    addReply(currentThread.id, replyText.trim(), replyMathFormula.trim() || undefined);
    setReplyText('');
    setReplyMathFormula('');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2 border border-emerald-200">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Open Mathematics Forum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Math Community: Questions & Discussions
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Post problems you are working through, view detailed step-by-step peer solutions, and clarify math concepts together.
          </p>
        </div>

        <button
          onClick={() => setIsAskModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 transition-all self-start md:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Ask a Math Question</span>
        </button>
      </div>

      {/* Filter and Subject Categories */}
      <div className="space-y-4">
        {/* Subject pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {SUBJECT_CATEGORIES.map((subj) => {
            const isSelected = selectedSubject === subj;
            return (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {subj}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions by formula, keywords, course, or concepts..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Questions List */}
      {filteredQuestions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No math questions found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Be the first student to start a discussion in this subject area!
          </p>
          <button
            onClick={() => setIsAskModalOpen(true)}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700"
          >
            Ask a Question
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q) => {
            const hasReplies = q.replies.length > 0;
            const hasSolution = q.replies.some((r) => r.isSolution);

            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 hover:shadow-sm transition-all p-5 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    {/* Tags line */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {q.subject}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
                        {q.course.split(' (')[0]}
                      </span>
                      {hasSolution && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                          <CheckCircle className="w-3 h-3" />
                          <span>Solved</span>
                        </span>
                      )}
                    </div>

                    {/* Question Title */}
                    <h3
                      onClick={() => setActiveThread(q)}
                      className="text-base font-bold text-slate-900 hover:text-emerald-700 cursor-pointer transition-colors leading-snug"
                    >
                      {q.title}
                    </h3>
                  </div>

                  {/* Upvote & Reply Counter Badges */}
                  <div className="flex items-center gap-2 self-start">
                    <button
                      onClick={() => toggleUpvoteQuestion(q.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        q.userUpvoted
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                      title="Upvote this math problem"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{q.upvotes}</span>
                    </button>

                    <button
                      onClick={() => setActiveThread(q)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-slate-500" />
                      <span>{q.replies.length}</span>
                    </button>
                  </div>
                </div>

                {/* Math Expression Box if provided */}
                {q.mathExpression && (
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 font-mono text-xs text-slate-800 overflow-x-auto">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5 font-sans">
                      Formula / Expression:
                    </span>
                    <code>{q.mathExpression}</code>
                  </div>
                )}

                {/* Question Summary Text */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {q.content}
                </p>

                {/* Author Info & Action Bar */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-700">{q.authorName}</span>
                    <BadgeDisplay
                      title={q.authorName === userProfile.displayName ? (featuredBadge?.title || 'Study Master') : (q.authorName === 'Chloe Lin' || q.authorName === 'Maya Patel' ? 'Top Contributor' : 'Study Master')}
                      tier={q.authorName === 'Chloe Lin' || q.authorName === userProfile.displayName ? 'gold' : 'silver'}
                      size="xs"
                    />
                    <span>&bull;</span>
                    <span className="text-blue-600 font-medium">{q.authorCampus.replace(' College', '')}</span>
                    <span>&bull;</span>
                    <span>{q.createdAt}</span>
                  </div>

                  <button
                    onClick={() => setActiveThread(q)}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
                  >
                    {hasReplies ? `View Discussion (${q.replies.length}) →` : 'Be the first to reply →'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Question Thread Modal / Drawer */}
      {currentThread && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto flex flex-col space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {currentThread.subject}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{currentThread.course}</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 leading-snug">
                  {currentThread.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span>Asked by <strong>{currentThread.authorName}</strong> ({currentThread.authorCampus})</span>
                  <span>&bull;</span>
                  <span>{currentThread.createdAt}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveThread(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Question Details Body */}
            <div className="space-y-3">
              {currentThread.mathExpression && (
                <div className="bg-slate-900 text-purple-200 p-3.5 rounded-xl font-mono text-xs overflow-x-auto shadow-inner">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block mb-1">
                    Mathematical Statement:
                  </span>
                  <code>{currentThread.mathExpression}</code>
                </div>
              )}

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {currentThread.content}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentThread.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px]">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Replies Section */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Discussion & Peer Solutions ({currentThread.replies.length})
                </h4>
              </div>

              {currentThread.replies.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-500 italic">
                  No replies yet. Provide an intuitive explanation or step-by-step working below!
                </div>
              ) : (
                <div className="space-y-3">
                  {currentThread.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className={`p-4 rounded-xl border space-y-2.5 ${
                        reply.isSolution
                          ? 'bg-emerald-50/50 border-emerald-200'
                          : 'bg-slate-50/70 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{reply.authorName}</span>
                          <BadgeDisplay
                            title={reply.authorName === userProfile.displayName ? (featuredBadge?.title || 'Top Contributor') : (reply.authorName === 'Chloe Lin' ? 'Top Contributor' : 'Study Master')}
                            tier="gold"
                            size="xs"
                          />
                          <span className="text-[11px] text-blue-600 font-medium">
                            {reply.authorCampus.replace(' College', '')}
                          </span>
                          {reply.isSolution && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                              <CheckCircle className="w-3 h-3" />
                              <span>Accepted Solution</span>
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => toggleUpvoteReply(currentThread.id, reply.id)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                            reply.userUpvoted
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>{reply.upvotes}</span>
                        </button>
                      </div>

                      {reply.mathFormula && (
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200 font-mono text-xs text-slate-800 overflow-x-auto">
                          <code>{reply.mathFormula}</code>
                        </div>
                      )}

                      <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                        {reply.content}
                      </p>

                      <div className="text-[10px] text-slate-400">{reply.createdAt}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reply Input Form */}
            <form onSubmit={handleSubmitReply} className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-800">
                Submit an Explanation or Solution
              </h4>

              {/* Math symbols picker */}
              <MathSymbolPicker onInsert={handleInsertReplySymbol} />

              {/* Optional Math Formula input */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Formula or Equation (Optional)
                </label>
                <input
                  type="text"
                  value={replyMathFormula}
                  onChange={(e) => setReplyMathFormula(e.target.value)}
                  placeholder="e.g. u = ln(x) => du = 1/x dx"
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 font-mono"
                />
              </div>

              {/* Reply explanation */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Your Explanation / Steps
                </label>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Walk through the concept step-by-step..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveThread(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Reply</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ask a Question Modal */}
      {isAskModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  New Question
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Ask the CCC Math Community
                </h3>
              </div>
              <button
                onClick={() => setIsAskModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmitQuestion} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Question Title / Problem Summary <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Finding limits as x approaches infinity with rational roots"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Subject & Course */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subject Field
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Precalculus">Precalculus</option>
                    <option value="Calculus">Calculus</option>
                    <option value="Linear Algebra">Linear Algebra</option>
                    <option value="Statistics">Statistics</option>
                    <option value="College Algebra">College Algebra</option>
                    <option value="Discrete Math">Discrete Math</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Related CCC Course
                  </label>
                  <select
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value as MathCourse)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  >
                    {MATH_COURSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Math Toolbar */}
              <MathSymbolPicker onInsert={handleInsertQuestionSymbol} />

              {/* Math expression input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Math Equation or Expression (Optional)
                </label>
                <input
                  type="text"
                  value={newMathExpr}
                  onChange={(e) => setNewMathExpr(e.target.value)}
                  placeholder="e.g. ∫ (3x² + 2x) dx or det(A - λI) = 0"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                />
              </div>

              {/* Detailed Content */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Problem Details & Where You Are Stuck <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Share what you have tried so far, or what theorem/formula feels unclear..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Topic Tags (Comma-separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. Limits, Asymptotes, Exam 1"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAskModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                >
                  Publish Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
