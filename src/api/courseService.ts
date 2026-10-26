import type {Subject} from '../types';
import {createResourceService} from './resourceService';

export const courseService = createResourceService<Subject>('courses');
