export interface IpcUpdateViewResponse {
  UpdateList: UpdateViewRequestItem[];
  Parameter: object;
}

export interface UpdateViewRequestItem {
  ScreenName: string;
  UpdateType: string;
}
