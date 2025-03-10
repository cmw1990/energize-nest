// Auto-generated types for Care Connector
import { Database } from './care8-types';

export type CareConnectorTables = Pick<
  Database['public']['Tables'], 
  | 'care8_groups'
  | 'care8_group_members'
  | 'care8_group_invitations'
  | 'care8_group_tasks'
  | 'care8_health_records'
  | 'care8_providers'
  | 'care8_provider_reviews'
  | 'care8_activity_log'
  | 'care8_group_events'
  | 'care8_group_posts'
  | 'care8_group_comments'
>;

export type CareGroup = Database['public']['Tables']['care8_groups']['Row'];
export type CareGroupInsert = Database['public']['Tables']['care8_groups']['Insert'];
export type CareGroupUpdate = Database['public']['Tables']['care8_groups']['Update'];

export type CareGroupMember = Database['public']['Tables']['care8_group_members']['Row'];
export type CareGroupMemberInsert = Database['public']['Tables']['care8_group_members']['Insert'];
export type CareGroupMemberUpdate = Database['public']['Tables']['care8_group_members']['Update'];

export type CareGroupInvitation = Database['public']['Tables']['care8_group_invitations']['Row'];
export type CareGroupInvitationInsert = Database['public']['Tables']['care8_group_invitations']['Insert'];
export type CareGroupInvitationUpdate = Database['public']['Tables']['care8_group_invitations']['Update'];

export type CareTask = Database['public']['Tables']['care8_group_tasks']['Row'];
export type CareTaskInsert = Database['public']['Tables']['care8_group_tasks']['Insert'];
export type CareTaskUpdate = Database['public']['Tables']['care8_group_tasks']['Update'];

export type CareHealthRecord = Database['public']['Tables']['care8_health_records']['Row'];
export type CareHealthRecordInsert = Database['public']['Tables']['care8_health_records']['Insert'];
export type CareHealthRecordUpdate = Database['public']['Tables']['care8_health_records']['Update'];

export type CareProvider = Database['public']['Tables']['care8_providers']['Row'];
export type CareProviderInsert = Database['public']['Tables']['care8_providers']['Insert'];
export type CareProviderUpdate = Database['public']['Tables']['care8_providers']['Update'];

export type CareProviderReview = Database['public']['Tables']['care8_provider_reviews']['Row'];
export type CareProviderReviewInsert = Database['public']['Tables']['care8_provider_reviews']['Insert'];
export type CareProviderReviewUpdate = Database['public']['Tables']['care8_provider_reviews']['Update'];

export type CareActivityLog = Database['public']['Tables']['care8_activity_log']['Row'];
export type CareActivityLogInsert = Database['public']['Tables']['care8_activity_log']['Insert'];
export type CareActivityLogUpdate = Database['public']['Tables']['care8_activity_log']['Update'];

export type CareGroupEvent = Database['public']['Tables']['care8_group_events']['Row'];
export type CareGroupEventInsert = Database['public']['Tables']['care8_group_events']['Insert'];
export type CareGroupEventUpdate = Database['public']['Tables']['care8_group_events']['Update'];

export type CareGroupPost = Database['public']['Tables']['care8_group_posts']['Row'];
export type CareGroupPostInsert = Database['public']['Tables']['care8_group_posts']['Insert'];
export type CareGroupPostUpdate = Database['public']['Tables']['care8_group_posts']['Update'];

export type CareGroupComment = Database['public']['Tables']['care8_group_comments']['Row'];
export type CareGroupCommentInsert = Database['public']['Tables']['care8_group_comments']['Insert'];
export type CareGroupCommentUpdate = Database['public']['Tables']['care8_group_comments']['Update'];
