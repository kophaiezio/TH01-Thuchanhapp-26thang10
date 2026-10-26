import type {Grade} from '../types';
import {createResourceService} from './resourceService';

export const gradeService = createResourceService<Grade>('grades');
