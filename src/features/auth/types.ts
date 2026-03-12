export interface SocialUser {
    userId: number
    email: string
    nickname: string
    joinedAt: string
    profileImageUrl?: string
}

export interface SocialLoginResponse {
    accessToken: string,
    refreshToken: string,
    isNewUser?: boolean,
    user: SocialUser
}