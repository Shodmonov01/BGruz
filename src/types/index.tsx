export type Bid = {
  cargoType: string;
  loadingMode: string;
  customerId: number;
  clientId?: any;
  loadingDate: string;
  endDate?: any;
  terminal1?: any;
  terminal2?: any;
  warehouses?: any;
  isPriceRequest: boolean;
  price?: any;
  vehicleProfileId: number;
  vehicleCount?: number;
  cargoTitle: string;
  loadingTime: string;
  extraServices?: any;
  description?: any;
  persistentId: string;
  systemCreationInfo?: any;
  id: any;
  createdAt: string;
  createdBy: string;
  updatedAt?: any;
  updatedBy?: any;
  client?: any;
  customer: Client;
  vehicleProfile: VehicleProfile;
  direction: any;
  parentId?: any;
  bidPrice?: any;
  deliveryDate?: any;
  ownState?: any;
  bgruzId?: any;
  number?: any;
  createdInBgruzAt?: any;
  status?: any;
  dueDate?: any;
  slideDate?: any;
  tradingFee?: any;
  extraServicesPrice?: any;
  normalGoSumm?: any;
  bidConditions?: any;
  createdByBgruzUserId?: any;
  priceNds?: any;
  fullPrice?: any;
  fullPriceNds?: any;
  bestSalePrice?: any;
  activationDelay?: any;
  commission?: any;
  activationTime?: any;
};

export type BidBatchQuery = {
  filter?: any;
  sort?: any;
  size?: any;
};

export type BidBatchResponse = {
  items: Bid[];
  total: number;
  hasMore: boolean;
};

export type BidCreate = {
  cargoType: string;
  loadingMode: string;
  customerId: number;
  clientId?: any;
  startDate: string;
  endDate?: any;
  terminal1?: any;
  terminal2?: any;
  warehouses?: any;
  isPriceRequest: boolean;
  price?: any;
  vehicleProfileId: number;
  vehicleCount?: number;
  cargoTitle: string;
  loadingTime: string;
  extraServices?: any;
  description?: any;
  persistentId?: any;
  systemCreationInfo?: any;
};

export type BidGridFilter = {
  number?: any;
  persistentId?: any;
  cargoType?: any;
  loadingMode?: any;
  loadingDate?: any;
  terminal1?: any;
  warehouses?: any;
  terminal2?: any;
  status?: any;
  isPriceRequest?: any;
  price?: any;
  vehicleProfile?: any;
  extraServicesPrice?: any;
  fullPrice?: any;
  commission?: any;
  fullPriceNDS?: any;
  clientName?: any;
  customerName?: any;
  createdBy?: any;
  createdAt?: any;
};

// export type BidOwnState = {
// };

export type BidResponse = {
  cargoType: string;
  loadingMode: string;
  customerId: number;
  clientId?: any;
  startDate: string;
  endDate?: any;
  terminal1?: any;
  terminal2?: any;
  warehouses?: any;
  isPriceRequest: boolean;
  price?: any;
  vehicleProfileId: number;
  vehicleCount?: number;
  cargoTitle: string;
  loadingTime: string;
  extraServices?: any;
  description?: any;
  persistentId: string;
  systemCreationInfo?: any;
  _id: string;
  createdAt: string;
  createdBy: string;
  updatedAt?: any;
  updatedBy?: any;
  client?: any;
  customer: Client;
  vehicleProfile: VehicleProfile;
  direction: any;
  parentId?: any;
  bidPrice?: any;
  deliveryDate?: any;
};

// export type BidStatus = {
// };

export type BidUpdate = {
  cargoType?: any;
  loadingMode?: any;
  customerId?: any;
  clientId?: any;
  startDate?: any;
  endDate?: any;
  terminal1?: any;
  terminal2?: any;
  warehouses?: any;
  isPriceRequest?: any;
  price?: any;
  vehicleProfileId?: any;
  vehicleCount?: any;
  cargoTitle?: any;
  filingTime?: any;
  extraServices?: any;
  description?: any;
  persistentId?: any;
  systemCreationInfo?: any;
};

export type BuyBidForOrder = {
  persistentId: string;
  number: string;
  loadingMode: string;
  cargoType: string;
  loadingDate: string;
  deliveryDate?: any;
  loadingTime: string;
  cargoTitle?: any;
  description?: any;
  terminal1?: any;
  terminal2?: any;
  warehouses?: any;
  vehicleProfile: VehicleProfile;
  customer?: any;
  client?: any;
  author?: any;
};

// export type CargoType = {
// };

export type City = {
  id: number;
  name: string;
  description?: any;
};

export type Client = {
  organizationId: number;
  organizationName: string;
  userId: number;
};

export type Contact = {
  fio: string;
  phone: string;
  email: string;
  organizationId: number;
  organizationName: string;
  organizationPhone: string;
  inn: string;
};

export type DateInterval = {
  start?: any;
  end?: any;
};

export type Direction = {
  id: number;
  fromCityId: number;
  toCityId: number;
  price?: any;
  delivery_period?: any;
};

// export type DocSubmissionStatus = {
// };

export type DocumentOrderItem = {
  documentOrder?: any;
  displayName: string;
  uriHtml: string;
  uriPdf: string;
  uriPdfDownload: string;
  dateCreate: string;
};

export type DownloadType = {
  id: number;
  name: string;
};

export type ExtraService = {
  classId?: any;
  count?: any;
  countIncluded?: any;
  id?: any;
  name?: any;
  packsDetailId?: any;
  maxCount?: any;
  price?: any;
  priceNds?: any;
  vehicleProfileId?: any;
  vehicleProfileName?: any;
  sortOrder?: any;
};

export type ExtraServiceCreate = {
  id: number;
  vehicleProfileId: number;
  count: number;
};

export type FileItem = {
  id: number;
  link: string;
  name: string;
  mime: string;
  description?: any;
  uploadTime: string;
  editPermission: boolean;
};

export type GridSorting = {
  filterFieldName?: any;
  direction?: any;
  startFrom?: any;
};

export type HTTPValidationError = {
  detail?: ValidationError[];
};

// export type LoadingMode = {
// };

export type Order = {
  id: number;
  buyBid: BuyBidForOrder;
  saleBid?: any;
  createdAt: string;
  customer: Contact;
  carrier: Contact;
  status: string;
  statusUpdated?: any;
  statusUpdatedUser?: any;
  docSubmissionDate?: any;
  docSubmissionUser?: any;
  driverUser?: any;
  price: any;
  priceNds: any;
  fullPrice: any;
  fullPriceNds: any;
  commission: any;
  cargoCost?: any;
  extraServicesPrice?: any;
  extraServicesPriceNds?: any;
  extraServices?: OrderExtraService[];
  assignedVehicle?: any;
  assignedTrailer?: any;
  assignedVehicleFiles?: any;
  assignedTrailerFiles?: any;
  assignedDriverFiles?: any;
  documentOrderItems?: DocumentOrderItem[];
};

export type OrderBatchQuery = {
  filter?: any;
  sort?: any;
  size?: any;
};

export type OrderBatchResponse = {
  items: Order[];
  total: number;
  hasMore: boolean;
};

export type OrderExtraService = {
  orderExtraServiceId?: any;
  billableCount: number;
  count: number;
  price: any;
  priceNds: any;
  totalPrice: any;
  totalPriceNds: any;
  sortOrder: number;
  maxCount: number;
  factoringMultiplier: number;
  totalFactoringMultiplier: number;
  packsDetailId: number;
  name: string;
  id?: any;
};

export type OrderGridFilter = {
  id?: any;
  persistentId?: any;
  cargoType?: any;
  loadingMode?: any;
  loadingDate?: any;
  terminal1?: any;
  warehouses?: any;
  terminal2?: any;
  loadingTime?: any;
  vehicleProfile?: any;
  status?: any;
  price?: any;
  extraServicesPrice?: any;
  fullPrice?: any;
  commission?: any;
  fullPriceNDS?: any;
  clientName?: any;
  customerName?: any;
  carrierName?: any;
  createdAt?: any;
  docSubmissionStatus?: any;
  docSubmitted?: any;
  driver?: any;
  vehiclePlateNumberAndModel?: any;
  trailerPlateNumberAndModel?: any;
  saleBidAuthor?: any;
  buyBidAuthor?: any;
  docSubmissionUser?: any;
  statusUpdatedUser?: any;
};

// export type OrderStatus = {
// };

export type Organization = {
  terminals: City[];
  warehouses: City[];
  joined_cities: City[];
  directions: Direction[];
  vehicleProfiles: VehicleProfile[];
  userContext: UserContext;
  extraServices: ExtraService[];
  activationDelay?: any;
};

export type RoutePoint = {
  cityId: number;
  cityName?: any;
  address: string;
};

export type SaleBidForOrder = {
  author?: any;
};

// export type SortDirection = {
// };

export type StartFromItem = {
  fieldValue?: any;
  id: string;
};

export type TimeResponse = {
  currentTime: string;
  currentBgruzTime: string;
};

export type UserContext = {
  userId: number;
  fullName: string;
  organizationId: number;
  organizationName: string;
  organizationTypeCode: string;
};

export type ValidationError = {
  loc: any[];
  msg: string;
  type: string;
};

export type Vehicle = {
  vehicleId: number;
  organizationId: number;
  vehicleClassId: number;
  vehicleProfileId: number;
  plateNum?: any;
  docModel?: any;
};

export type VehicleProfile = {
  id: number;
  name: string;
  description?: any;
  downloadTypeId?: any;
  downloadType?: any;
  tonnageId?: any;
  vehicleTypeId?: any;
  sortOrder?: any;
};

export type models__user__User = {
  username: string;
  legacyCookie?: any;
  legacyCookieExpired?: any;
  disabled?: boolean;
  refreshToken?: any;
  createdAt?: string;
  updatedAt?: string;
  linkedUserIds?: any;
  organizationId?: any;
  organizationName?: any;
  organizationTypeCode?: any;
};

export type schemas__order__User = {
  id: number;
  username: string;
  email?: any;
  fio?: any;
  phone?: any;
};

// export type WSMessageType = {
// };

export type WSMessageBase = {
  type: string;
  timestamp?: string;
};

export type BidUpdateMessage = {
  type?: any;
  timestamp?: string;
  payload: BidUpdatePayload;
};

export type OrderUpdateMessage = {
  type?: any;
  timestamp?: string;
  payload: OrderUpdatePayload;
};

export type StatusMessage = {
  type?: any;
  timestamp?: string;
  payload: StatusPayload;
};

export type ErrorMessage = {
  type?: any;
  timestamp?: string;
  payload: ErrorPayload;
};

export type BidUpdatePayload = {
  id: string;
  status: string;
};

export type OrderUpdatePayload = {
  id: number;
  status: string;
};

export type StatusPayload = {
  status: string;
  details?: any;
};

export type ErrorPayload = {
  code: number;
  message: string;
  details?: any;
};

