type QcAvailable = {
  id: number;
  dataSource: {
    name: string;
    displayName: string;
  };
  qcPhotos: PhotoSet[];
  timeFetched: string;
};

type PhotoSet = {
  id: number;
  photoUrl: string;
};

export type QcResponse = Array<QcAvailable>;
