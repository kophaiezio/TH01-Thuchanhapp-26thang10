import type {Student} from '../types';
import {createResourceService} from './resourceService';

export const studentService = createResourceService<Student>('students');
