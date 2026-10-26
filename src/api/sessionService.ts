import type {ScheduleSession} from '../types';
import {createResourceService} from './resourceService';

export const sessionService =
  createResourceService<ScheduleSession>('sessions');
