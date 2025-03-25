import forge from "node-forge";

export class PshRSA {
  /**
   * Criptografa uma string usando RSA-OAEP com uma chave pública PEM
   * @param secret String a ser criptografada
   * @param publicKeyPem Chave pública em formato PEM
   * @returns Promise com a string criptografada em base64
   */
  static encrypt(secret: string, publicKeyPem: string): Promise<string> {
    try {
      const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

      // Converter a string para bytes (importante para manipulação correta de caracteres)
      const buffer = forge.util.createBuffer(secret, "utf8");
      const bytes = buffer.getBytes();

      // Usar RSA-OAEP explicitamente
      const encrypted = publicKey.encrypt(bytes, "RSA-OAEP", {
        md: forge.md.sha256.create(), // Usar SHA-256 para hash
        mgf1: {
          md: forge.md.sha256.create(), // Usar SHA-256 para função de geração de máscara
        },
      });

      // Codificar o resultado em base64
      const encodedEncrypted = forge.util.encode64(encrypted);

      return Promise.resolve(encodedEncrypted);
    } catch (error) {
      console.error(error);
      return Promise.reject(new Error("Erro na criptografia!"));
    }
  }

  /**
   * Descriptografa uma string criptografada com RSA-OAEP usando uma chave privada PEM
   * @param encryptedBase64 String criptografada em formato base64
   * @param privateKeyPem Chave privada em formato PEM
   * @param passphrase Senha opcional para descriptografar a chave privada protegida
   * @returns Promise com a string descriptografada
   */
  static decrypt(
    encryptedBase64: string,
    privateKeyPem: string,
    passphrase?: string,
  ): Promise<string> {
    try {
      // Carregar a chave privada a partir do formato PEM, com suporte a passphrase
      let privateKey;

      if (passphrase) {
        // Se a chave estiver protegida por passphrase
        try {
          privateKey = forge.pki.decryptRsaPrivateKey(
            privateKeyPem,
            passphrase,
          );
          if (!privateKey) {
            throw new Error(
              "Falha ao descriptografar a chave privada com a passphrase fornecida",
            );
          }
        } catch (e) {
          const _e = e as Error;
          throw new Error(
            `Falha ao descriptografar a chave privada: ${_e.message}`,
          );
        }
      } else {
        // Se a chave não estiver protegida
        privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
      }

      // Decodificar o texto criptografado de base64 para bytes
      const encryptedBytes = forge.util.decode64(encryptedBase64);

      // Descriptografar usando RSA-OAEP
      const decrypted = privateKey.decrypt(encryptedBytes, "RSA-OAEP", {
        md: forge.md.sha256.create(), // Usar SHA-256 para hash (deve corresponder ao encrypt)
        mgf1: {
          md: forge.md.sha256.create(), // Usar SHA-256 para função de geração de máscara
        },
      });

      // Converter os bytes descriptografados de volta para string
      const decryptedText = forge.util.decodeUtf8(decrypted);

      return Promise.resolve(decryptedText);
    } catch (error) {
      console.error(error);
      return Promise.reject(new Error("Erro na descriptografia!"));
    }
  }

  /**
   * Auxiliar para gerar um par de chaves RSA
   * @param bits Tamanho da chave em bits (2048, 3072, 4096 são opções comuns)
   * @param passphrase Senha opcional para proteger a chave privada
   * @returns Promise com um objeto contendo as chaves pública e privada em formato PEM
   */
  static generateKeyPair(
    bits: number = 2048,
    passphrase?: string,
  ): Promise<{ publicKey: string; privateKey: string }> {
    return new Promise((resolve, reject) => {
      try {
        // Gerar o par de chaves assincronamente
        forge.pki.rsa.generateKeyPair(
          { bits },
          (err: Error, keypair: { publicKey: string; privateKey: string }) => {
            if (err) {
              reject(new Error(`Falha ao gerar par de chaves: ${err.message}`));
              return;
            }

            // Converter a chave pública para formato PEM
            const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);

            // Converter a chave privada para formato PEM, com ou sem proteção por passphrase
            let privateKeyPem;

            if (passphrase && passphrase.length > 0) {
              // Proteger a chave privada com passphrase
              privateKeyPem = forge.pki.encryptRsaPrivateKey(
                keypair.privateKey,
                passphrase,
                {
                  algorithm: "aes256", // Algoritmo de criptografia
                  count: 10000, // Número de iterações para derivação de chave
                  saltSize: 128 / 8, // Tamanho do salt em bytes (128 bits)
                  prfAlgorithm: "sha512", // Algoritmo de função pseudoaleatória
                },
              );
            } else {
              // Sem proteção por passphrase
              privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);
            }

            resolve({
              publicKey: publicKeyPem,
              privateKey: privateKeyPem,
            });
          },
        );
      } catch (error) {
        console.error(error);
        reject(new Error("Erro na geração de chaves"));
      }
    });
  }
}
