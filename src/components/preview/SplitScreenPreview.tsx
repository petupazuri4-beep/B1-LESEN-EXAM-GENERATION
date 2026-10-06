import React from 'react';
import { ExamModel } from '../../types/exam';
import { TeacherSplitPreview } from '../TeacherSplitPreview';
import { Language } from '../../utils/i18n';

interface Props {
  exam: ExamModel;
  lang?: Language;
}

export const SplitScreenPreview: React.FC<Props> = ({ exam, lang = 'de' }) => {
  return <TeacherSplitPreview exam={exam} lang={lang} />;
};
