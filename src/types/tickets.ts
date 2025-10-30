export type TagType = {
  id: number;
  name: string;
};

export type StatusType = {
  id: number;
  name: string;
};

export type TicketType = {
  id: number;
  title: string;
  description: string;
  status_id: number;
  tag_id: number;
  message_id: number;
  author_id: number;
  updater_id: number;
  created_at: string;
  updated_at: string;
  status_name: string;
  tag_name: string;
  author_name: string;
  message_text?: string;
  admin_name?: string;
};

export type CreateTicketFormType = {
  onCancel: VoidFunction;
  onSuccess: VoidFunction;
};

export type TicketDetailsType = {
  ticket: TicketType | null;
  isAdmin?: boolean;
  onClose: VoidFunction;
  onUpdate?: VoidFunction;
};
