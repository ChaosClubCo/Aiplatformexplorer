import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Question, UserAnswer, QuestionOption } from '../types/recommendation';

interface QuestionCardProps {
  question: Question;
  answer?: UserAnswer;
  onAnswer: (questionId: string, answer: UserAnswer) => void;
  questionNumber: number;
  totalQuestions: number;
}

export default function QuestionCard({
  question,
  answer,
  onAnswer,
  questionNumber,
  totalQuestions
}: QuestionCardProps) {
  const [selectedValue, setSelectedValue] = useState<any>(answer?.value);
  const [selectedOptions, setSelectedOptions] = useState<QuestionOption[]>(answer?.selectedOptions || []);
  const [priorityList, setPriorityList] = useState<string[]>(
    answer?.value || question.options?.map(opt => opt.value as string) || []
  );

  useEffect(() => {
    if (answer) {
      setSelectedValue(answer.value);
      setSelectedOptions(answer.selectedOptions || []);
      if (question.type === 'priority' && answer.value) {
        setPriorityList(answer.value);
      }
    } else {
      // Reset on question change
      setSelectedValue(undefined);
      setSelectedOptions([]);
      if (question.type === 'priority' && question.options) {
        setPriorityList(question.options.map(opt => opt.value as string));
      }
    }
  }, [question.id, answer]);

  const handleSingleSelect = (option: QuestionOption) => {
    setSelectedValue(option.value);
    setSelectedOptions([option]);
    onAnswer(question.id, {
      questionId: question.id,
      value: option.value,
      selectedOptions: [option]
    });
  };

  const handleMultiSelect = (option: QuestionOption) => {
    const isSelected = selectedOptions.some(opt => opt.value === option.value);
    
    let newSelectedOptions: QuestionOption[];
    if (isSelected) {
      newSelectedOptions = selectedOptions.filter(opt => opt.value !== option.value);
    } else {
      newSelectedOptions = [...selectedOptions, option];
    }
    
    setSelectedOptions(newSelectedOptions);
    onAnswer(question.id, {
      questionId: question.id,
      value: newSelectedOptions.map(opt => opt.value),
      selectedOptions: newSelectedOptions
    });
  };

  const handleRangeChange = (value: number) => {
    setSelectedValue(value);
    onAnswer(question.id, {
      questionId: question.id,
      value: value,
      selectedOptions: undefined
    });
  };

  const handleBooleanSelect = (value: boolean) => {
    setSelectedValue(value);
    onAnswer(question.id, {
      questionId: question.id,
      value: value,
      selectedOptions: undefined
    });
  };

  const handlePriorityReorder = (dragIndex: number, hoverIndex: number) => {
    const newList = [...priorityList];
    const draggedItem = newList[dragIndex];
    newList.splice(dragIndex, 1);
    newList.splice(hoverIndex, 0, draggedItem);
    
    setPriorityList(newList);
    onAnswer(question.id, {
      questionId: question.id,
      value: newList,
      selectedOptions: undefined
    });
  };

  return (
    <div className="bg-white border-2 border-[#EDE8E3] rounded-2xl p-8 shadow-sm">
      {/* Question Header */}
      <div className="mb-6">
        <h2 className="text-2xl mb-2 font-serif text-[#231C19]">
          {question.text}
        </h2>
        {question.helpText && (
          <p className="text-[#5C524D] flex items-start gap-2">
            <span className="text-[#E88A1D] mt-0.5">ℹ️</span>
            <span>{question.helpText}</span>
          </p>
        )}
      </div>

      {/* Answer Input */}
      <div className="space-y-3">
        {question.type === 'single' && question.options && (
          <div className="grid gap-3">
            {question.options.map((option, index) => (
              <motion.button
                key={option.value}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSingleSelect(option)}
                className={`p-4 border-2 rounded-xl text-left transition-all ${
                  selectedValue === option.value
                    ? 'border-[#E88A1D] bg-[#FEF3E7]'
                    : 'border-[#EDE8E3] hover:border-[#D9D2CC] hover:bg-[#FAFAFA]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selectedValue === option.value
                      ? 'border-[#E88A1D] bg-[#E88A1D]'
                      : 'border-[#D9D2CC]'
                  }`}>
                    {selectedValue === option.value && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-[#231C19] mb-1">{option.label}</div>
                    {option.description && (
                      <div className="text-sm text-[#8B8279]">{option.description}</div>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {question.type === 'multi' && question.options && (
          <div className="grid gap-3">
            {question.options.map((option, index) => {
              const isSelected = selectedOptions.some(opt => opt.value === option.value);
              
              return (
                <motion.button
                  key={option.value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleMultiSelect(option)}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'border-[#E88A1D] bg-[#FEF3E7]'
                      : 'border-[#EDE8E3] hover:border-[#D9D2CC] hover:bg-[#FAFAFA]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected
                        ? 'border-[#E88A1D] bg-[#E88A1D]'
                        : 'border-[#D9D2CC]'
                    }`}>
                      {isSelected && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-[#231C19] mb-1">{option.label}</div>
                      {option.description && (
                        <div className="text-sm text-[#8B8279]">{option.description}</div>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {question.type === 'range' && question.rangeConfig && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-serif text-[#E88A1D] mb-2">
                {selectedValue !== undefined ? selectedValue : question.rangeConfig.min}
                <span className="text-xl text-[#8B8279] ml-2">{question.rangeConfig.unit}</span>
              </div>
            </div>
            
            <input
              type="range"
              min={question.rangeConfig.min}
              max={question.rangeConfig.max}
              step={question.rangeConfig.step}
              value={selectedValue !== undefined ? selectedValue : question.rangeConfig.min}
              onChange={(e) => handleRangeChange(Number(e.target.value))}
              className="w-full h-3 bg-[#EDE8E3] rounded-full appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #E88A1D 0%, #E88A1D ${
                  ((selectedValue || question.rangeConfig.min) - question.rangeConfig.min) / 
                  (question.rangeConfig.max - question.rangeConfig.min) * 100
                }%, #EDE8E3 ${
                  ((selectedValue || question.rangeConfig.min) - question.rangeConfig.min) / 
                  (question.rangeConfig.max - question.rangeConfig.min) * 100
                }%, #EDE8E3 100%)`
              }}
            />
            
            <div className="flex justify-between text-sm text-[#8B8279]">
              <span>{question.rangeConfig.min} {question.rangeConfig.unit}</span>
              <span>{question.rangeConfig.max} {question.rangeConfig.unit}</span>
            </div>

            {/* Quick select buttons for common values */}
            {question.id === 'team-size' && (
              <div className="flex gap-2 flex-wrap justify-center mt-4">
                {[10, 50, 100, 500, 1000, 5000].map(value => (
                  <button
                    key={value}
                    onClick={() => handleRangeChange(value)}
                    className={`px-3 py-1 text-sm rounded-full transition-all ${
                      selectedValue === value
                        ? 'bg-[#E88A1D] text-white'
                        : 'bg-[#EDE8E3] text-[#5C524D] hover:bg-[#D9D2CC]'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            )}

            {question.id === 'budget-per-user' && (
              <div className="flex gap-2 flex-wrap justify-center mt-4">
                {[10, 20, 30, 50, 75, 100].map(value => (
                  <button
                    key={value}
                    onClick={() => handleRangeChange(value)}
                    className={`px-3 py-1 text-sm rounded-full transition-all ${
                      selectedValue === value
                        ? 'bg-[#E88A1D] text-white'
                        : 'bg-[#EDE8E3] text-[#5C524D] hover:bg-[#D9D2CC]'
                    }`}
                  >
                    ${value}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {question.type === 'boolean' && (
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => handleBooleanSelect(true)}
              className={`p-6 border-2 rounded-xl text-center transition-all ${
                selectedValue === true
                  ? 'border-[#E88A1D] bg-[#FEF3E7]'
                  : 'border-[#EDE8E3] hover:border-[#D9D2CC] hover:bg-[#FAFAFA]'
              }`}
            >
              <div className="text-4xl mb-2">✅</div>
              <div className="font-semibold">Yes</div>
            </motion.button>
            
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              onClick={() => handleBooleanSelect(false)}
              className={`p-6 border-2 rounded-xl text-center transition-all ${
                selectedValue === false
                  ? 'border-[#E88A1D] bg-[#FEF3E7]'
                  : 'border-[#EDE8E3] hover:border-[#D9D2CC] hover:bg-[#FAFAFA]'
              }`}
            >
              <div className="text-4xl mb-2">❌</div>
              <div className="font-semibold">No</div>
            </motion.button>
          </div>
        )}

        {question.type === 'priority' && question.options && (
          <div className="space-y-3">
            <div className="bg-[#E0F2FE] border border-[#0284C7] rounded-lg p-3 text-sm text-[#0284C7]">
              💡 Drag and drop to reorder by importance (top = most important)
            </div>
            
            {priorityList.map((value, index) => {
              const option = question.options?.find(opt => opt.value === value);
              if (!option) return null;
              
              return (
                <motion.div
                  key={value}
                  layout
                  className="p-4 bg-white border-2 border-[#EDE8E3] rounded-xl cursor-move hover:border-[#E88A1D] transition-all group"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/html', index.toString());
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const dragIndex = parseInt(e.dataTransfer.getData('text/html'));
                    handlePriorityReorder(dragIndex, index);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#E88A1D] to-[#D97706] text-white rounded-full flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      <svg className="w-5 h-5 text-[#8B8279] group-hover:text-[#E88A1D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 15h18M3 9h18" />
                      </svg>
                    </div>
                    <div className="flex-1 font-semibold text-[#231C19]">
                      {option.label}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
