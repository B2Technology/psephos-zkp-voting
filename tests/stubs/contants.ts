import { type CryptoSystemJSON, KeyPair } from "@psephos/elgamal";
import type { IPshElection } from "../../src/types/index.ts";
import {
  PshAnswerProtocolEnum,
  PshIdentityProtocolEnum,
} from "../../src/types/index.ts";

// Parâmetros criptográficos para testes
export const CRYPTO_PARAMS: CryptoSystemJSON = {
  p: "16328632084933010002384055033805457329601614771185955389739167309086214800406465799038583634953752941675645562182498120750264980492381375579367675648771293800310370964745767014243638518442553823973482995267304044326777047662957480269391322789378384619428596446446984694306187644767462460965622580087564339212631775817895958409016676398975671266179637898557687317076177218843233150695157881061257053019133078545928983562221396313169622475509818442661047018436264806901023966236718367204710755935899013750306107738002364137917426595737403871114187750804346564731250609196846638183903982387884578266136503697493474682071",
  g: "14887492224963187634282421537186040801304008017743492304481737382571933937568724473847106029915040150784031882206090286938661464458896494215273989547889201144857352611058572236578734319505128042602372864570426550855201448111746579871811249114781674309062693442442368697449970648232621880001709535143047913661432883287150003429802392229361583608686643243349727791976247247948618930423866180410558458272606627111270040091203073580238905303994472202930783207472394578498507764703191288249547659899997131166130259700604433891232298182348403175947450284433411265966789131024573629546048637848902243503970966798589660808533",
  q: "61329566248342901292543872769978950870633559608669337131139375508370458778917",
};

export const ELECTION_DATA: IPshElection = {
  "cast_url":
    "https://vote.heliosvoting.org/helios/elections/b3b99f04-fed2-11ee-9eff-2a72e601f5ab/cast",
  "description": "teste",
  "frozen_at": "2024-04-20 05:04:39.979911",
  "name": "Exemplo election",
  "openreg": true,
  "questions": [
    {
      "answer_urls": [
        "",
        "",
      ],
      "answers": [
        "ET Bilu",
        "ET varginha",
      ],
      "choice_type": "approval",
      "max": 1,
      "min": 0,
      "question": "Melhor ET",
      "randomize_answer_order": false,
      "result_type": "absolute",
      "short_name": "Melhor ET",
      "tally_type": "homomorphic",
    },
  ],
  "short_name": "demo-51",
  "use_voter_aliases": false,
  "uuid": "b3b99f04-fed2-11ee-9eff-2a72e601f5ab",
  "voters_hash": null,
  "election_hash": null,
  "voting_ends_at": "2024-09-20 12:00:00",
  "voting_starts_at": "2024-01-01 12:00:00",
  "answer_protocol": PshAnswerProtocolEnum.Plaintext,
  "identity_protocol": PshIdentityProtocolEnum.Plaintext,
};

const keys = KeyPair.fromJSON({
  pk: {
    p: "16328632084933010002384055033805457329601614771185955389739167309086214800406465799038583634953752941675645562182498120750264980492381375579367675648771293800310370964745767014243638518442553823973482995267304044326777047662957480269391322789378384619428596446446984694306187644767462460965622580087564339212631775817895958409016676398975671266179637898557687317076177218843233150695157881061257053019133078545928983562221396313169622475509818442661047018436264806901023966236718367204710755935899013750306107738002364137917426595737403871114187750804346564731250609196846638183903982387884578266136503697493474682071",
    q: "61329566248342901292543872769978950870633559608669337131139375508370458778917",
    g: "14887492224963187634282421537186040801304008017743492304481737382571933937568724473847106029915040150784031882206090286938661464458896494215273989547889201144857352611058572236578734319505128042602372864570426550855201448111746579871811249114781674309062693442442368697449970648232621880001709535143047913661432883287150003429802392229361583608686643243349727791976247247948618930423866180410558458272606627111270040091203073580238905303994472202930783207472394578498507764703191288249547659899997131166130259700604433891232298182348403175947450284433411265966789131024573629546048637848902243503970966798589660808533",
    y: "14142017230655221981257567785998213023422870406130764641473933420045452672096265944793465601016181881293707743708621510948665351674896282882241203107430354196088525784262017648394004186661493410717866686021849315095610218552640294500132096251709262309968123888788774134585787850051305660593267632520578698586825807697811841503349327681919041162544743310728751735143182392602093965089997508477074795650595481101703537364850635327457494291579219401841226539345925783533998586093410539790025035054313124724088816472450191420253778323388454854430405510030267701706240882362581947435372407990302025337359313290113434398028",
  },
  sk: {
    x: "32299884680128226258879804289641396302743499498066581786060832454151441512940",
    publicKey: {
      p: "16328632084933010002384055033805457329601614771185955389739167309086214800406465799038583634953752941675645562182498120750264980492381375579367675648771293800310370964745767014243638518442553823973482995267304044326777047662957480269391322789378384619428596446446984694306187644767462460965622580087564339212631775817895958409016676398975671266179637898557687317076177218843233150695157881061257053019133078545928983562221396313169622475509818442661047018436264806901023966236718367204710755935899013750306107738002364137917426595737403871114187750804346564731250609196846638183903982387884578266136503697493474682071",
      q: "61329566248342901292543872769978950870633559608669337131139375508370458778917",
      g: "14887492224963187634282421537186040801304008017743492304481737382571933937568724473847106029915040150784031882206090286938661464458896494215273989547889201144857352611058572236578734319505128042602372864570426550855201448111746579871811249114781674309062693442442368697449970648232621880001709535143047913661432883287150003429802392229361583608686643243349727791976247247948618930423866180410558458272606627111270040091203073580238905303994472202930783207472394578498507764703191288249547659899997131166130259700604433891232298182348403175947450284433411265966789131024573629546048637848902243503970966798589660808533",
      y: "14142017230655221981257567785998213023422870406130764641473933420045452672096265944793465601016181881293707743708621510948665351674896282882241203107430354196088525784262017648394004186661493410717866686021849315095610218552640294500132096251709262309968123888788774134585787850051305660593267632520578698586825807697811841503349327681919041162544743310728751735143182392602093965089997508477074795650595481101703537364850635327457494291579219401841226539345925783533998586093410539790025035054313124724088816472450191420253778323388454854430405510030267701706240882362581947435372407990302025337359313290113434398028",
    },
  },
});

export const PUBLIC_KEY = keys.pk;
export const SECRET_KEY = keys.sk;

export const PSH_RSA = {
  passphrase: "psephos2025",
  publicKey: "-----BEGIN PUBLIC KEY-----\n" +
    "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtmfeS9lkXgSxd15fbuIr\n" +
    "5rU5ZWxRsfnhagrZ/wt9/bjx1a3DyEll9HhC3gUTEgeGFMisGseo8kX/KEt4Vaod\n" +
    "5fwAXokLomn1ZWZtpVeiHBJeKpTsgYPXYdLzhwGo9XTjbxh6N592AVKQJkZ6H2e9\n" +
    "48pTGp9prLmDtH9xpcwoRZmJl6EuDjohSEAMsyfYeNkxfkT/AAnMH5ygJyRkQoO/\n" +
    "Gfh3oRRe9Say3kxYXlFKyMEllboKzLGAEPFx2zmGHU9/eXbs47dD5GA/iQu8CJhe\n" +
    "ugfgEOhL5H0rgeTlTULp6dDUM6QX+dW8EjV1X5XvCM6/wcFjeH4dY0XT4o1Lb+mR\n" +
    "WQIDAQAB\n" +
    "-----END PUBLIC KEY-----\n",
  privateKey: "-----BEGIN ENCRYPTED PRIVATE KEY-----\n" +
    "MIIFHzBJBgkqhkiG9w0BBQ0wPDAbBgkqhkiG9w0BBQwwDgQIQ4jWS0Zxf5oCAggA\n" +
    "MB0GCWCGSAFlAwQBAgQQ6PKYkHKyugSBCXkic6vkWQSCBNCOyEthhmcMj6/WqZOr\n" +
    "Er+N2xHlrWqzmzhcwQfp4gFaZIWYBryy35dO6t+kty7SW8bEFNPBxO7kryWZnxwT\n" +
    "OnUYcNOCBbKrliITLvjZiwiGZPNQi4fcPVs7gqaIdtssfW0+3NjMs+Ro2xAt4ONc\n" +
    "bPVqEmKblkSMSsGAu7wq37TBNexeabnGbxkqb3/43N9JEJPP5BHpZLGnA3IqZbe/\n" +
    "VpAPxiMU78cOV2Wk5l2hH4SuveiRz7EHoZ/Sb4E5KpE8j2L6jMBRgKFmw9Tm3wAf\n" +
    "bV1z/MoJKXOfMn0WTBKNravGr2cWF4eUZ8rFitUp8lDmWd5zhRLmYcp7erUxsdql\n" +
    "hDIKjf71Y9c1COO87y7Ye011Qns8ZIsVWnHqQeDaqJYX6adnTXqrWIZv62TUdO2r\n" +
    "dja9M1HI9UAeWW1LZ5uN2pJtBn8eBtBny3d9Z3Vy+SWRG+bzMJ3b/NOWHrJUFouc\n" +
    "suyiHz8YKtYstEaScUjlxuEX7SOy4mWcdTzeC0Sv1qL2GWcXc6jWULH/HXsTf0YB\n" +
    "A1GEpP3V30Zos5fIEMVNwXWbARJxq2UpwGxw1RsJJ+AyTVJ9bL+yA3uYznRglSa+\n" +
    "ekotvVoacX3wFAFdgpMbcvp9Zo4Y9aMzWmYGjCGmzJcRN2y6s3pyWboUmhQEwzmH\n" +
    "J2gPAw1EhWCLIDkdoi6/r9AW/lvlVbc0McfXKFEV48Sg3nKu8a7b3mureyY0zQAe\n" +
    "oSjGCt88zfDMvX+0MV5EuWvuIr+mtxpX44TWxU7vHOGhyu/sYQ/CNTRN4sCgQXVw\n" +
    "vjxJrtPNnGNthYHZMNsU/K93cwgDefAnzcIvOIIHdtHGaNvPqswF9gvxNKryPfuS\n" +
    "7y69zvdC8tneOedDewsAh7uOQh7vnOQwWRwmmYMets89gd7l7eY76IIFCmuYFTQY\n" +
    "Kab1Kv/uYezuzUr9E3CJsdAEHkr7NduBG4xeqpmQrf0h0JaiHjwJkVYHSKVFFghZ\n" +
    "8Zr5/gJ5SRSa/IsFrRXTNGH6McXNE6odxO8BTfQ9pCutl2yxwLeaPCII8n3Wpm6W\n" +
    "J625LDsSchIgMIveig4Fl2SPym7vs+aXW1F7udKrC6uoDVbXbPK2GYejXdBTxNf2\n" +
    "6FSNkQzTHGirmWCMztAhXc7lee/hliwX1F7GTZRE9VdD3M26E38u85Y2kE7oTGwL\n" +
    "U2imVuZg5cSGx6D2eu4nuQUlIwtoQ57a+Rzp3isiwBuVHxYhDlOyEXT7YBYd4F8l\n" +
    "EDrGW5Mz+KsccZn+OorT469Z6kcxaZnOi+aOjz5l/I6AfUvV8adMml+N9wiHOJGW\n" +
    "hLoB7c3hGIHZKPpAMP6YPUqD5kk78Ptp84cX4vd7TZlsG+t7MzDwXWupavXMI12V\n" +
    "z5Tn/aJkGNT4IwEv03zyLC98fBQK65PxDCKMKNvgWd8Dasz8fjzi042KfseFWkS9\n" +
    "F2u1xDxdd36nu/TPipkqtv+pTbdYJUCz8a7/N2R1Fq+ZmrSyplcY+XpnJ0L9JjhX\n" +
    "YKJvA3s0t5FAFYOI4xUVTmEvT0bgAxCvtYgCkDItclrlQNcN3LYdxbJFxNunuqrN\n" +
    "YTpky5RPjPJRg5vBJx+6yS+c8FQhS5uWIyZkbqjj2I5ge5U4C3f7GYQrswdesfUn\n" +
    "aw7kq5s50zAY/4XSuEHFi6C0xw==\n" +
    "-----END ENCRYPTED PRIVATE KEY-----\n",
};
