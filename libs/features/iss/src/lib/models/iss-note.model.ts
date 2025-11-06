export interface IssNote {
  id: string;
  date: string;                 // 'YYYY-MM-DD'
  consumer: string;             // 'James Harris'
  initials?: string;            // 'AM'
  location?: string;            // 'Sports Bar'
  activity?: string;            // 'Pro sports viewing'
  comment: string;              // compliant narrative
  tags?: string[];              // ['off-site','bowling']
  createdAt?: string;
  updatedAt?: string;
}
