export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? "361238149966512",
    clientSecret: process.env.FB_CLIENT_SECRET ?? "2042211e00c1585dfcaacad242a430a9"
  },
  port: process.env.PORT ?? 8080,
  jwtSecret: process.env.JWT_SECRET ?? "asdf23xd"
};
