import type {Assignment} from '../types';
import {createResourceService} from './resourceService';

export const assignmentService =
  createResourceService<Assignment>('assignments');
