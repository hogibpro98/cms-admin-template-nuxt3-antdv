export default defineEventHandler(() => {
  let ramdom = Math.floor(Math.random() * 2);
  if (ramdom%2===0) {
    return {
      "code": 1,
      "status": 200,
      "data": {
        "status": 200,
        "user": {
          "email": "account_test@dialpad.com"
        },
        "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE3MTE1Mjc4NjIsImV4cCI6MTcxMTYxNDI2MiwibmJmIjoxNzExNTI3ODYyLCJqdGkiOiJ0QzRqYXdlWXhmWUpOSnQ4Iiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.bHWhqq0U5qaoxinjk_s0C4fTV6-cB3V_10k_qLoBkhw",
        "token_type": "bearer"
      }
    };
  }

  return {"code":0,"status":401,"data":{"message_error":"Unauthenticated"}};
});
