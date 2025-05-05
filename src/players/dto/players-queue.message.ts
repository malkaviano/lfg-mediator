import { PlayersQueueRequest } from '@/players/dto/players-queue.request';

export interface PlayersQueueMessage extends PlayersQueueRequest {
  readonly queuedAt: string;
}

/*
{"pattern":"queue-player","data":{"dungeons":["Deadmines"],"players":[{"id":"e180e3d1-83b6-455f-bfce-cfb7d13bd6d5","level":20,"roles":["Tank"]},{"id":"b70f9587-9b0d-4b4f-be95-d92808570f42","level":22,"roles":["Damage"]}]}}

{"pattern":"queue-player","data":{"dungeons":["Deadmines"],"players":[{"id":"ff97bdc9-a107-42fb-8225-c4768ad0bc2b","level":20,"roles":["Healer"]},{"id":"f641331d-9b86-42b2-9c40-13da6da82851","level":21,"roles":["Damage"]}]}}

{"pattern":"queue-player","data":{"dungeons":["Deadmines"],"players":[{"id":"41060bb0-a6d6-4b89-9d3b-de89bfb79c2a","level":21,"roles":["Damage"]}]}}
*/
