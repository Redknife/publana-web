export type SolanaAds = {
  "version": "0.1.0",
  "name": "solana_ads",
  "instructions": [
    {
      "name": "createAd",
      "accounts": [
        {
          "name": "ad",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "viktrchAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "kolyanAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "derivedAddress",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "content",
          "type": "string"
        },
        {
          "name": "textLimit",
          "type": "u32"
        },
        {
          "name": "rank",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateAd",
      "accounts": [
        {
          "name": "ad",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "content",
          "type": "string"
        }
      ]
    },
    {
      "name": "appendAdContent",
      "accounts": [
        {
          "name": "ad",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "content",
          "type": "string"
        }
      ]
    },
    {
      "name": "deleteAd",
      "accounts": [
        {
          "name": "ad",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "ad",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "content",
            "type": "string"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "textLimit",
            "type": "u32"
          },
          {
            "name": "rank",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "TitleTooLong",
      "msg": "The provided title should be 280 characters long maximum."
    },
    {
      "code": 6001,
      "name": "TextLimitExceeded",
      "msg": "Can not update Ad. Text limit will be exceeded."
    }
  ]
};

export const IDL: SolanaAds = {
  "version": "0.1.0",
  "name": "solana_ads",
  "instructions": [
    {
      "name": "createAd",
      "accounts": [
        {
          "name": "ad",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "viktrchAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "kolyanAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "derivedAddress",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "content",
          "type": "string"
        },
        {
          "name": "textLimit",
          "type": "u32"
        },
        {
          "name": "rank",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateAd",
      "accounts": [
        {
          "name": "ad",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "content",
          "type": "string"
        }
      ]
    },
    {
      "name": "appendAdContent",
      "accounts": [
        {
          "name": "ad",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "content",
          "type": "string"
        }
      ]
    },
    {
      "name": "deleteAd",
      "accounts": [
        {
          "name": "ad",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "ad",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "content",
            "type": "string"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "textLimit",
            "type": "u32"
          },
          {
            "name": "rank",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "TitleTooLong",
      "msg": "The provided title should be 280 characters long maximum."
    },
    {
      "code": 6001,
      "name": "TextLimitExceeded",
      "msg": "Can not update Ad. Text limit will be exceeded."
    }
  ]
};
