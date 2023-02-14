import { MComponent } from '@edoms/schema';

export interface CameraItem {
  cameraName: string;
  videoSource: string;
}

export interface VideoConfigs extends MComponent {
  cameras: CameraItem[];
}
