const {hashToken,randomToken}=require('./tokens');
test('random tokens are unique and hash consistently',()=>{const a=randomToken(),b=randomToken();expect(a).not.toBe(b);expect(hashToken(a)).toHaveLength(64);expect(hashToken(a)).toBe(hashToken(a));});
