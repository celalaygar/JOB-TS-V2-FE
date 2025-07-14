export enum InvitationStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    DECLINED = 'DECLINED'
}
export interface Invitation {
    id: string;
    status: InvitationStatus;
    project: {
        id: string;
        name: string;
    };
    invitedBy: {
        id: string;
        email: string;
        firstname: string;
        lastname: string;
    };
    invitedUser: {
        id: string;
        email: string;
        firstname: string;
        lastname: string;
    };
    team: string | null;
    createdAt: string;
    token: string | null;
    tokenExpiry: string;
}
