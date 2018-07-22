package com.androidcat.eppv2.utils;

/**
 * Created by IntelliJ IDEA.
 * User: fibiger
 * Date: 2009-05-05
 * Time: 10:18:48
 * To change this template use File | Settings | File Templates.
 */

import java.math.BigInteger;
import java.nio.ByteBuffer;
import java.security.Key;
import java.security.KeyFactory;
import java.security.MessageDigest;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;
import java.security.spec.KeySpec;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.RSAPrivateKeySpec;
import java.security.spec.RSAPublicKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Random;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

/**
 * 3DES,MAC,HEX Utils
 */
public class Tool {

	public	static  String convertInt2String(int n, int len) {
		String str = String.valueOf(n);
		int strLen = str.length();

		String zeros = "";
		for (int loop = len - strLen; loop > 0; loop--) {
			zeros += "0";
		}

		if (n >= 0) {
			return zeros + str;
		} else {
			return "-" + zeros + str.substring(1);
		}
	}

	// key:手机号码
	// value:会话信息

	/**
	 * 将byte数组转换成16进制组成的字符串 例如 一个byte数组 b[0]=0x07;b[1]=0x10;...b[5]=0xFB;
	 * byte2hex(b); 将返回一个字符串"0710BE8716FB"
	 *
	 * @param buffer
	 *            待转换的byte数组
	 * @return
	 */
	public static String byteToHex(byte[] buffer) {
		StringBuffer hexString = new StringBuffer();
		String hex;
		int iValue;

		for (int i = 0; i < buffer.length; i++) {
			iValue = buffer[i];
			if (iValue < 0)
				iValue += 256;

			hex = Integer.toString(iValue, 16);
			if (hex.length() == 1)
				hexString.append("0" + hex);
			else
				hexString.append(hex);
		}

		return hexString.toString().toUpperCase();
	}

	public static String byteToHex(byte[] buffer, int offset, int len) {
		StringBuffer hexString = new StringBuffer();
		String hex;
		int iValue;

		for (int i = offset; i < offset + len; i++)
		{
			iValue = buffer[i];
			if (iValue < 0)
				iValue += 256;

			hex = Integer.toString(iValue, 16);
			if (hex.length() == 1)
				hexString.append("0" + hex);
			else
				hexString.append(hex);
		}

		return hexString.toString().toUpperCase();
	}


	public static byte[] hexToBytes(String hex) {
		byte[] buffer = new byte[hex.length() / 2];
		String strByte;

		for (int i = 0; i < buffer.length; i++) {
			strByte = hex.substring(i * 2, i * 2 + 2);
			buffer[i] = (byte) Integer.parseInt(strByte, 16);
		}

		return buffer;
	}

	/**
	 * 将16进制组成的字符串转换成byte数组 例如 hex2Byte("0710BE8716FB"); 将返回一个byte数组
	 * b[0]=0x07;b[1]=0x10;...b[5]=0xFB;
	 *
	 * @param src
	 *            待转换的16进制字符串
	 * @return
	 */
	public static byte[] str2bytes(String src) {
		if (src == null || src.length() == 0 || src.length() % 2 != 0) {
			return null;
		}
		int nSrcLen = src.length();
		byte byteArrayResult[] = new byte[nSrcLen / 2];
		StringBuffer strBufTemp = new StringBuffer(src);
		String strTemp;
		int i = 0;
		while (i < strBufTemp.length() - 1) {
			strTemp = src.substring(i, i + 2);
			byteArrayResult[i / 2] = (byte) Integer.parseInt(strTemp, 16);
			i += 2;
		}
		return byteArrayResult;
	}

	public static String intToHex(int value) {
		String hex;

		hex = Integer.toString(value, 16);

		if (hex.length() % 2 != 0) {
			hex = "0" + hex;
		}

		return hex.toUpperCase();
	}

	/**
	 * 将整数转为16进行数后并以指定长度返回（当实际长度大于指定长度时只返回从末位开始指定长度的值）
	 *
	 * @param val
	 *            待转换整数
	 * @param len
	 *            指定长度
	 * @return String
	 */
	public static String Int2HexStr(int val, int len) {
		String result = Integer.toHexString(val).toUpperCase();// EEEEEEEEE
		int r_len = result.length();
		if (r_len > len) {
			return result.substring(r_len - len, r_len);
		}
		if (r_len == len) {
			return result;
		}
		StringBuffer strBuff = new StringBuffer(result);
		for (int i = 0; i < len - r_len; i++) {
			strBuff.insert(0, '0');
		}
		return strBuff.toString();
	}

	/**
	 * 将长整数转为16进行数后并以指定长度返回（当实际长度大于指定长度时只返回从末位开始指定长度的值）
	 *
	 * @param val
	 *            待转换长整数
	 * @param len
	 *            指定长度
	 * @return String
	 */
	public static String Long2HexStr(long val, int len) {
		String result = Long.toHexString(val).toUpperCase();
		int r_len = result.length();
		if (r_len > len) {
			return result.substring(r_len - len, r_len);
		}
		if (r_len == len) {
			return result;
		}
		StringBuffer strBuff = new StringBuffer(result);
		for (int i = 0; i < len - r_len; i++) {
			strBuff.insert(0, '0');
		}
		return strBuff.toString();
	}

	/**
	 * 将整数转换成byte数组 例如: 输入: n = 1000000000 ( n = 0x3B9ACA00) 输出: byte[0]:3b
	 * byte[1]:9a byte[2]:ca byte[3]:00 注意: 输入的整数必须在[-2^32, 2^32-1]的范围内
	 *
	 * @param n
	 *            整型值
	 * @return byte数组
	 */
	public static byte[] int2Bytes(int n) {
		ByteBuffer bb = ByteBuffer.allocate(4);
		bb.putInt(n);
		return bb.array();
	}

	/**
	 * 将长整数转换成byte数组 例如: 输入: n = 1000000000 ( n = 0x3B9ACA00) 输出: byte[0]:3b
	 * byte[1]:9a byte[2]:ca byte[3]:00 注意: 输入的长整数必须在[-2^64, 2^64-1]的范围内
	 *
	 * @param l
	 *            长整型值
	 * @return byte数组
	 */
	public static byte[] long2Bytes(long l) {
		ByteBuffer bb = ByteBuffer.allocate(8);
		bb.putLong(l);
		return bb.array();
	}

	/**
	 * 将无符号的4个字节的byte数据转换成32bit的长整形
	 *
	 * @param buf
	 *            无符号的4个字节数据
	 * @return 32bit的长整形
	 */
	public static long unsigned4BytesToInt(byte[] buf) {
		int firstByte = 0;
		int secondByte = 0;
		int thirdByte = 0;
		int fourthByte = 0;
		firstByte = (0x000000FF & ((int) buf[0]));
		secondByte = (0x000000FF & ((int) buf[1]));
		thirdByte = (0x000000FF & ((int) buf[2]));
		fourthByte = (0x000000FF & ((int) buf[3]));
		return ((long) (firstByte << 24 | secondByte << 16 | thirdByte << 8 | fourthByte)) & 0xFFFFFFFFL;
	}

	/**
	 * 生成len个字节的十六进制随机数字符串 例如:len=8 则可能会产生 DF15F0BDFADE5FAF 这样的字符串
	 *
	 * @param len
	 *            待产生的字节数
	 * @return String
	 */
	public static String yieldHexRand(int len) {
		StringBuffer strBufHexRand = new StringBuffer();
		Random rand = new Random(System.currentTimeMillis());
		int index;
		// 随机数字符
		char charArrayHexNum[] = { '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'A', 'B', 'C', 'D', 'E', 'F' };
		for (int i = 0; i < len * 2; i++) {
			index = Math.abs(rand.nextInt()) % 16;
			if (i == 0) {
				while (charArrayHexNum[index] == '0') {
					index = Math.abs(rand.nextInt()) % 16;
				}
			}
			strBufHexRand.append(charArrayHexNum[index]);
		}
		return strBufHexRand.toString();
	}

	/**
	 * 按位异或byte数组 (两个byte数组的长度必须一样)
	 *
	 * @param b1
	 * @param b2
	 * @return
	 */
	public static String doXOR(String b1, String b2) {
		if (b1.length() != b2.length()) {
			return null;
		}

		byte[] byte1 = str2bytes(b1);
		byte[] byte2 = str2bytes(b2);

		byte[] result = new byte[byte1.length];
		for (int i = 0; i < byte1.length; i++) {
			int temp = (byte1[i] ^ byte2[i]) & 0xff;
			result[i] = (byte) temp;
		}
		return byteToHex(result);
	}

	/**
	 * 按位求反byte数组
	 *
	 * @param b
	 * @return
	 */
	public static String doReverse(String b) {
		byte[] byte1 = str2bytes(b);
		for (int i = 0; i < byte1.length; i++) {
			byte1[i] = (byte) (~byte1[i] & 0xff);
		}
		return byteToHex(byte1);
	}

	/**
	 * 将16个字节的密钥转换成24个字节的密钥，24个字节的密钥的前8个密钥和后8个密钥相同
	 *
	 * @param key
	 *            待转换密钥(16个字节 由2个8字节密钥组成)
	 * @return
	 */
	public static String key16To24(String key) {
		// 计算加解密密钥，即将16个字节的密钥转换成24个字节的密钥，24个字节的密钥的前8个密钥和后8个密钥相同
		if (key.length() == 32) {
			return key + key.substring(0, 16); // 将key前8个字节复制到keyresult的最后8个字节
		} else {
			return null;
		}
	}

	/**
	 * 填充05数据，如果结果数据块是8的倍数，不再进行追加,如果不是,追加0x05到数据块的右边，直到数据块的长度是8的倍数。
	 *
	 * @param data
	 *            待填充05的数据
	 * @return
	 */
	public static String padding05(String data) {
		int padlen = 8 - (data.length() / 2) % 8;
		if (padlen != 8) {
			String padstr = "";
			for (int i = 0; i < padlen; i++)
				padstr += "05";
			data += padstr;
			return data;
		} else {
			return data;
		}
	}

	/**
	 * 填充00数据，如果结果数据块是8的倍数，不再进行追加,如果不是,追加0x00到数据块的右边，直到数据块的长度是8的倍数。
	 *
	 * @param data
	 *            待填充00的数据
	 * @return
	 */
	public static String padding00(String data) {
		int padlen = 8 - (data.length() / 2) % 8;
		if (padlen != 8) {
			String padstr = "";
			for (int i = 0; i < padlen; i++)
				padstr += "00";
			data += padstr;
			return data;
		} else {
			return data;
		}
	}

	/**
	 * 填充20数据，如果结果数据块是8的倍数，不再进行追加,如果不是,追加0x20到数据块的右边，直到数据块的长度是8的倍数。
	 *
	 * @param data
	 *            待填充20的数据
	 * @return
	 */
	public static String padding20(String data) {
		int padlen = 8 - (data.length() / 2) % 8;
		if (padlen != 8) {
			String padstr = "";
			for (int i = 0; i < padlen; i++)
				padstr += "20";
			data += padstr;
			return data;
		} else {
			return data;
		}
	}

	/**
	 * 填充80数据，首先在数据块的右边追加一个
	 * '80',如果结果数据块是8的倍数，不再进行追加,如果不是,追加0x00到数据块的右边，直到数据块的长度是8的倍数。
	 *
	 * @param data
	 *            待填充80的数据
	 * @return
	 */
	public static String padding80(String data) {
		int padlen = 8 - (data.length() / 2) % 8;
		String padstr = "";
		for (int i = 0; i < padlen - 1; i++)
			padstr += "00";
		data = data + "80" + padstr;
		return data;
	}

	/**
	 * CBC模式中的DES/3DES/TDES算法(数据不需要填充),支持8、16、24字节的密钥 说明：3DES/TDES解密算法 等同与
	 * 先用前8个字节密钥DES解密 再用中间8个字节密钥DES加密 最后用后8个字节密钥DES解密 一般前8个字节密钥和后8个字节密钥相同
	 *
	 * @param key
	 *            加解密密钥(8字节:DES算法 16字节:3DES/TDES算法
	 *            24个字节:3DES/TDES算法,一般前8个字节密钥和后8个字节密钥相同)
	 * @param data
	 *            待加/解密数据(长度必须是8的倍数)
	 * @param icv
	 *            初始链值(8个字节) 一般为8字节的0x00
	 * @param mode
	 *            0-加密，1-解密
	 * @return 加解密后的数据 为null表示操作失败
	 */
	public static String descbc(String key, String data, String icv, int mode) {
		try {
			// 判断加密还是解密
			int opmode = (mode == 0) ? Cipher.ENCRYPT_MODE : Cipher.DECRYPT_MODE;

			SecretKey keySpec = null;

			Cipher enc = null;

			// 判断密钥长度
			if (key.length() == 16) {
				// 生成安全密钥
				keySpec = new SecretKeySpec(str2bytes(key), "DES");// key

				// 生成算法
				enc = Cipher.getInstance("DES/CBC/NoPadding");
			} else if (key.length() == 32) {
				// 计算加解密密钥，即将16个字节的密钥转换成24个字节的密钥，24个字节的密钥的前8个密钥和后8个密钥相同,并生成安全密钥
				keySpec = new SecretKeySpec(str2bytes(key + key.substring(0, 16)), "DESede");// 将key前8个字节复制到keycbc的最后8个字节

				// 生成算法
				enc = Cipher.getInstance("DESede/CBC/NoPadding");
			} else if (key.length() == 48) {
				// 生成安全密钥
				keySpec = new SecretKeySpec(str2bytes(key), "DESede");// key

				// 生成算法
				enc = Cipher.getInstance("DESede/CBC/NoPadding");
			} else {
				System.out.println("Key length is error");
				return null;
			}

			// 生成ICV
			IvParameterSpec ivSpec = new IvParameterSpec(str2bytes(icv));// icv

			// 初始化
			enc.init(opmode, keySpec, ivSpec);

			// 返回加解密结果
			return byteToHex(enc.doFinal(str2bytes(data)));// 开始计算
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
		}
		return null;
	}

	/**
	 * CBC模式中的DES/3DES/TDES算法(数据需要填充80),支持8、16、24字节的密钥 说明：3DES/TDES解密算法 等同与
	 * 先用前8个字节密钥DES解密 再用中间8个字节密钥DES加密 最后用后8个字节密钥DES解密 一般前8个字节密钥和后8个字节密钥相同
	 *
	 * @param key
	 *            加解密密钥(8字节:DES算法 16字节:3DES/TDES算法
	 *            24个字节:3DES/TDES算法,一般前8个字节密钥和后8个字节密钥相同)
	 * @param data
	 *            待加/解密数据
	 * @param icv
	 *            初始链值(8个字节) 一般为8字节的0x00
	 * @param mode
	 *            0-加密，1-解密
	 * @return 加解密后的数据 为null表示操作失败
	 */
	public static String descbcNeedPadding80(String key, String data, String icv, int mode) {
		return descbc(key, padding80(data), icv, mode);
	}

	/**
	 * ECB模式中的DES/3DES/TDES算法(数据不需要填充),支持8、16、24字节的密钥 说明：3DES/TDES解密算法 等同与
	 * 先用前8个字节密钥DES解密 再用中间8个字节密钥DES加密 最后用后8个字节密钥DES解密 一般前8个字节密钥和后8个字节密钥相同
	 *
	 * @param key
	 *            加解密密钥(8字节:DES算法 16字节:3DES/TDES算法
	 *            24个字节:3DES/TDES算法,一般前8个字节密钥和后8个字节密钥相同)
	 * @param data
	 *            待加/解密数据(长度必须是8的倍数)
	 * @param mode
	 *            0-加密，1-解密
	 * @return 加解密后的数据 为null表示操作失败
	 */
	public static String desecb(String key, String data, int mode) {
		try {

			// 判断加密还是解密
			int opmode = (mode == 0) ? Cipher.ENCRYPT_MODE : Cipher.DECRYPT_MODE;

			SecretKey keySpec = null;

			Cipher enc = null;

			// 判断密钥长度
			if (key.length() == 16) {
				// 生成安全密钥
				keySpec = new SecretKeySpec(str2bytes(key), "DES");// key

				// 生成算法
				enc = Cipher.getInstance("DES/ECB/NoPadding");
			} else if (key.length() == 32) {
				// 计算加解密密钥，即将16个字节的密钥转换成24个字节的密钥，24个字节的密钥的前8个密钥和后8个密钥相同,并生成安全密钥
				keySpec = new SecretKeySpec(str2bytes(key + key.substring(0, 16)), "DESede");// 将key前8个字节复制到keyecb的最后8个字节

				// 生成算法
				enc = Cipher.getInstance("DESede/ECB/NoPadding");
			} else if (key.length() == 48) {
				// 生成安全密钥
				keySpec = new SecretKeySpec(str2bytes(key), "DESede");// key

				// 生成算法
				enc = Cipher.getInstance("DESede/ECB/NoPadding");
			} else {
				System.out.println("Key length is error");
				return null;
			}

			// 初始化
			enc.init(opmode, keySpec);

			// 返回加解密结果
			return byteToHex(enc.doFinal(str2bytes(data)));// 开始计算
		} catch (Exception e) {
			try {
				System.out.println(e.getMessage());
			} catch (Exception e1) {
				e1.printStackTrace();
			}
		}
		return null;
	}

	/**
	 * ECB模式中的DES/3DES/TDES算法(数据需要填充80),支持8、16、24字节的密钥 说明：3DES/TDES解密算法 等同与
	 * 先用前8个字节密钥DES解密 再用中间8个字节密钥DES加密 最后用后8个字节密钥DES解密 一般前8个字节密钥和后8个字节密钥相同
	 *
	 * @param key
	 *            加解密密钥(8字节:DES算法 16字节:3DES/TDES算法
	 *            24个字节:3DES/TDES算法,一般前8个字节密钥和后8个字节密钥相同)
	 * @param data
	 *            待加/解密数据
	 * @param mode
	 *            0-加密，1-解密
	 * @return 加解密后的数据 为null表示操作失败
	 */
	public static String desecbNeedPadding80(String key, String data, int mode) {
		return desecb(key, padding80(data), mode);
	}

	/**
	 * ECB模式中的DES算法(数据不需要填充)
	 *
	 * @param key
	 *            加解密密钥(8个字节)
	 * @param data
	 *            输入:待加/解密数据(长度必须是8的倍数) 输出:加/解密后的数据
	 * @param mode
	 *            0-加密，1-解密
	 * @return
	 */
	public static void des(byte[] key, byte[] data, int mode) {
		try {
			if (key.length == 8) {
				// 判断加密还是解密
				int opmode = (mode == 0) ? Cipher.ENCRYPT_MODE : Cipher.DECRYPT_MODE;

				// 生成安全密钥
				SecretKey keySpec = new SecretKeySpec(key, "DES");// key

				// 生成算法
				Cipher enc = Cipher.getInstance("DES/ECB/NoPadding");

				// 初始化
				enc.init(opmode, keySpec);

				// 加解密结果
				byte[] temp = enc.doFinal(data); // 开始计算

				System.arraycopy(temp, 0, data, 0, 8); // 将加解密结果复制一份到data
			}
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
	}

	/**
	 * 产生MAC算法3,即Single DES加上最终的TDES MAC,支持8、16字节的密钥 这也叫Retail
	 * MAC,它是在[ISO9797-1]中定义的MAC算法3，带有输出变换3、没有截断，并且用DES代替块加密
	 *
	 * @param key
	 *            密钥(8字节:CBC/DES算法 16字节:先CBC/DES，再完成3DES/TDES算法)
	 * @param data
	 *            要计算MAC的数据
	 * @param icv
	 *            初始链向量 (8个字节) 一般为8字节的0x00
	 * @param padding
	 *            0：填充0x00 (PIM专用) 1：填充0x20 (SIM卡专用 必须输出8个字节) 2：填充0x80
	 *            (GP卡用)3:填充0x05（卡门户应用）
	 * @param outlength
	 *            返回的MAC长度 1：4个字节 2：8个字节
	 * @return
	 */
	public static String generateMAC(String key, String data, String icv, int padding, int outlength) {
		try {
			if (key.length() == 32 || key.length() == 16) {
				byte[] leftKey = new byte[8];
				byte[] rightKey = new byte[8];
				System.arraycopy(str2bytes(key), 0, leftKey, 0, 8); // 将key复制一份到leftKey

				byte[] icvTemp = str2bytes(icv); // 将icv复制一份到icvTemp

				// 实际参与计算的数据
				byte[] dataTemp = null;

				if (padding == 0) {
					dataTemp = str2bytes(padding00(data)); // 填充0x00
				} else if (padding == 1) {
					dataTemp = str2bytes(padding20(data)); // 填充0x20
				} else if (padding == 2) {
					dataTemp = str2bytes(padding80(data)); // 填充0x80
				} else if (padding == 3) {
					dataTemp = str2bytes(padding05(data));
				}// 填充0x05

				int nCount = dataTemp.length / 8;
				for (int i = 0; i < nCount; i++) {
					for (int j = 0; j < 8; j++)
						// 初始链值与输入数据异或
						icvTemp[j] ^= dataTemp[i * 8 + j];
					des(leftKey, icvTemp, 0); // DES加密
				}
				if (key.length() == 32) // 如果key的长度是16个字节
				{
					System.arraycopy(str2bytes(key), 8, rightKey, 0, 8); // 将key复制一份到rightKey
					des(rightKey, icvTemp, 1); // DES解密
					des(leftKey, icvTemp, 0); // DES加密
				}
				String mac = byteToHex(icvTemp);
				return (outlength == 1 && padding != 1) ? mac.substring(0, 8) : mac;// 返回结果
			} else {
				System.out.println("Key length is error");
			}
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		return null;
	}

	/**
	 * 产生MAC算法1,即Full TDES MAC,支持16、24字节的密钥 这也叫完整的TDES
	 * MAC,它是在[ISO9797-1]中定义的MAC算法1，带有输出变换1，没有截断，并且用TDES代替块加密。
	 *
	 * @param key
	 *            密钥(16字节:3DES/TDES算法 24字节:3DES/TDES算法)
	 * @param data
	 *            要计算MAC的数据
	 * @param icv
	 *            初始链向量 (8个字节) 一般为8字节的0x00
	 * @param padding
	 *            0：填充0x00 (PIM专用) 1：填充0x20 (SIM卡专用 必须输出8个字节) 2：填充0x80 (GP卡用)
	 * @param outlength
	 *            返回的MAC长度 1：4个字节 2：8个字节
	 * @return
	 */
	public static String generateMACAlg1(String key, String data, String icv, int padding, int outlength) {
		try {
			if (key.length() == 32 || key.length() == 48) {
				byte[] icvTemp = str2bytes(icv); // 将icv复制一份到icvTemp

				// 实际参与计算的数据
				byte[] dataTemp = null;

				if (padding == 0) {
					dataTemp = str2bytes(padding00(data)); // 填充0x00
				} else if (padding == 1) {
					dataTemp = str2bytes(padding20(data)); // 填充0x20
				} else {
					dataTemp = str2bytes(padding80(data)); // 填充0x80
				}

				int nCount = dataTemp.length / 8;
				for (int i = 0; i < nCount; i++) {
					for (int j = 0; j < 8; j++)
						// 初始链值与输入数据异或
						icvTemp[j] ^= dataTemp[i * 8 + j];
					String resulticv = desecb(key, byteToHex(icvTemp), 0); // 3DES/TDES加密
					System.arraycopy(str2bytes(resulticv), 0, icvTemp, 0, 8); // 将icv复制一份到icvTemp
				}
				String mac = byteToHex(icvTemp);
				return (outlength == 1 && padding != 1) ? mac.substring(0, 8) : mac;// 返回结果
			} else {
				System.out.println("Key length is error");
			}
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		return null;
	}

	/**
	 * 产生MAC算法2,即RIPEMD-MAC,支持8、16字节的密钥 这也叫RIPEMD-MAC(RIPEMD-MAC [RIPE 93] +
	 * EMAC (DMAC) [Petrank-Rackoff 98]),
	 * 它是在[ISO9797-1]中定义的MAC算法2，带有输出变换2、没有截断，并且用DES代替块加密
	 *
	 * @param key
	 *            密钥(8字节:CBC/DES算法 16字节:先CBC/DES，再完成3DES/TDES算法)
	 * @param data
	 *            要计算MAC的数据
	 * @param icv
	 *            初始链向量 (8个字节) 一般为8字节的0x00
	 * @param padding
	 *            0：填充0x00 (PIM专用) 1：填充0x20 (SIM卡专用 必须输出8个字节) 2：填充0x80 (GP卡用)
	 * @param outlength
	 *            返回的MAC长度 1：4个字节 2：8个字节
	 * @return
	 */
	public static String generateMACAlg2(String key, String data, String icv, int padding, int outlength) {
		try {
			if (key.length() == 32 || key.length() == 16) {
				byte[] leftKey = new byte[8];
				byte[] rightKey = new byte[8];
				System.arraycopy(str2bytes(key), 0, leftKey, 0, 8); // 将key复制一份到leftKey

				byte[] icvTemp = str2bytes(icv); // 将icv复制一份到icvTemp

				// 实际参与计算的数据
				byte[] dataTemp = null;

				if (padding == 0) {
					dataTemp = str2bytes(padding00(data)); // 填充0x00
				} else if (padding == 1) {
					dataTemp = str2bytes(padding20(data)); // 填充0x20
				} else {
					dataTemp = str2bytes(padding80(data)); // 填充0x80
				}

				int nCount = dataTemp.length / 8;
				for (int i = 0; i < nCount; i++) {
					for (int j = 0; j < 8; j++)
						// 初始链值与输入数据异或
						icvTemp[j] ^= dataTemp[i * 8 + j];
					des(leftKey, icvTemp, 0); // DES加密
				}
				if (key.length() == 32) // 如果key的长度是16个字节
				{
					System.arraycopy(str2bytes(key), 8, rightKey, 0, 8); // 将key复制一份到rightKey
					des(rightKey, icvTemp, 0); // DES加密
				}
				String mac = byteToHex(icvTemp);
				return (outlength == 1 && padding != 1) ? mac.substring(0, 8) : mac;// 返回结果
			} else {
				System.out.println("Key length is error");
			}
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		return null;
	}

	/**
	 * 产生MAC算法4,支持16、24字节的密钥
	 * 这也叫Mac-DES,它是在[ISO9797-1]中定义的MAC算法4，带有输出变换4，没有截断，并且用DES代替块加密。
	 *
	 * @param key
	 *            密钥(16字节:3DES/TDES算法 24字节:3DES/TDES算法)
	 * @param data
	 *            要计算MAC的数据
	 * @param icv
	 *            初始链向量 (8个字节) 一般为8字节的0x00
	 * @param padding
	 *            0：填充0x00 (PIM专用) 1：填充0x20 (SIM卡专用 必须输出8个字节) 2：填充0x80 (GP卡用)
	 * @param outlength
	 *            返回的MAC长度 1：4个字节 2：8个字节
	 * @return
	 */
	public static String generateMACAlg4(String key, String data, String icv, int padding, int outlength) {
		try {
			byte[] leftKey = new byte[8];
			byte[] middleKey = new byte[8];
			byte[] rightKey = new byte[8];

			if (key.length() == 48) {
				System.arraycopy(str2bytes(key), 16, rightKey, 0, 8); // 将key的最右边8个字节复制一份到rightKey
			} else if (key.length() == 32) {
				System.arraycopy(str2bytes(key), 8, rightKey, 0, 8); // 将key的最右边8个字节复制一份到rightKey
			} else {
				System.out.println("Key length is error");
				return null;
			}

			System.arraycopy(str2bytes(key), 0, leftKey, 0, 8); // 将key的最左边8个字节复制一份到leftKey
			System.arraycopy(str2bytes(key), 8, middleKey, 0, 8); // 将key的中间8个字节复制一份到middleKey

			byte[] icvTemp = str2bytes(icv); // 将icv复制一份到icvTemp

			// 实际参与计算的数据
			byte[] dataTemp = null;

			if (padding == 0) {
				dataTemp = str2bytes(padding00(data)); // 填充0x00
			} else if (padding == 1) {
				dataTemp = str2bytes(padding20(data)); // 填充0x20
			} else {
				dataTemp = str2bytes(padding80(data)); // 填充0x80
			}

			int nCount = dataTemp.length / 8;
			for (int i = 0; i < nCount; i++) {
				for (int j = 0; j < 8; j++)
					// 初始链值与输入数据异或
					icvTemp[j] ^= dataTemp[i * 8 + j];
				des(leftKey, icvTemp, 0); // DES加密
				if (i == 0)
					des(rightKey, icvTemp, 0); // DES加密
				if (i == nCount - 1)
					des(middleKey, icvTemp, 0); // DES加密
			}
			String mac = byteToHex(icvTemp);
			return (outlength == 1 && padding != 1) ? mac.substring(0, 8) : mac;// 返回结果
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		return null;
	}

	/**
	 * 生成CRC32
	 *
	 * @param data
	 *            待处理数据
	 * @param strinitcrc
	 *            长度必须为8
	 * @param lastblock
	 *            1:最后取反
	 * @return 8个字节的CRC
	 */
	public static String generateCRC32(byte[] data, byte[] strinitcrc, int lastblock) {
		long crc32 = unsigned4BytesToInt(strinitcrc);
		for (int i = 0; i < data.length; i++)
			crc32 = lGenCRC32(crc32, data[i]);
		if (lastblock == 1)
			crc32 = ~crc32;
		return Long2HexStr(crc32, 8);
	}

	/**
	 * 生成CRC32
	 *
	 * @param lOldCRC
	 *            the crc32 value
	 * @param ByteVal
	 *            the new data byte
	 * @return
	 */
	public static long lGenCRC32(long lOldCRC, byte ByteVal) {
		long TabVal;
		int j;
		TabVal = ((lOldCRC) ^ ByteVal) & 0xff;
		for (j = 8; j > 0; j--) {
			if ((TabVal & 1) == 1) {
				TabVal = (TabVal >> 1) ^ 0xEDB88320L;
			} else {
				TabVal >>= 1;
			}
		}
		return TabVal ^ (((lOldCRC) >> 8) & 0x00FFFFFFL);
	}

	/**
	 * SHA-1摘要
	 *
	 * @param data
	 *            要计算SHA-1摘要的数据
	 * @return 16进制字符串形式的SHA-1消息摘要，一般为20字节 为null表示操作失败
	 */
	public static String generateSHA1(String data) {
		try {
			// 使用getInstance("算法")来获得消息摘要,这里使用SHA-1的160位算法
			MessageDigest messageDigest = MessageDigest.getInstance("SHA-1");

			// 开始使用算法
			messageDigest.update(str2bytes(data));

			// 输出算法运算结果
			byte[] hashValue = messageDigest.digest(); // 20位字节

			return byteToHex(hashValue);
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		return null;
	}

	/**
	 * RSA签名
	 *
	 * @param N
	 *            RSA的模modulus
	 * @param E
	 *            RSA公钥的指数exponent
	 * @param D
	 *            RSA私钥的指数exponent
	 * @param data
	 *            输入数据
	 * @param mode
	 *            0-加密，1-解密
	 * @param type
	 *            0-私钥加密，公钥解密 1-公钥加密，私钥解密
	 * @return 签名后的数据 为null表示操作失败
	 */
	public static String generateRSA(String N, String E, String D, String data, int mode, int type) {
		try {
			// 判断加密还是解密
			int opmode = (mode == 0) ? Cipher.ENCRYPT_MODE : Cipher.DECRYPT_MODE;

			KeyFactory keyFactory = KeyFactory.getInstance("RSA");
			BigInteger big_N = new BigInteger(N, 16);
			Key key = null;

			if (mode != type) { // 生成公钥
				BigInteger big_E = new BigInteger(E, 16);
				KeySpec keySpec = new RSAPublicKeySpec(big_N, big_E);
				key = keyFactory.generatePublic(keySpec);
			} else { // 生成私钥
				BigInteger big_D = new BigInteger(D);
				KeySpec keySpec = new RSAPrivateKeySpec(big_N, big_D);
				key = keyFactory.generatePrivate(keySpec);
			}

			// 获得一个RSA的Cipher类，使用私钥加密
			Cipher cipher = Cipher.getInstance("RSA/ECB/NoPadding"); // RSA/ECB/PKCS1Padding

			// 初始化
			cipher.init(opmode, key);

			// 返回加解密结果
			return byteToHex(cipher.doFinal(str2bytes(data)));// 开始计算
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		return null;
	}

	/**
	 * RSA签名
	 *
	 * @param key
	 *            RSA的密钥 公钥用X.509编码；私钥用PKCS#8编码
	 * @param data
	 *            输入数据
	 * @param mode
	 *            0-加密，1-解密
	 * @param type
	 *            0-私钥加密，公钥解密 1-公钥加密，私钥解密
	 * @return 签名后的数据 为null表示操作失败
	 */
	public static String generateRSA(String key, String data, int mode, int type) {
		try {
			// 判断加密还是解密
			int opmode = (mode == 0) ? Cipher.ENCRYPT_MODE : Cipher.DECRYPT_MODE;

			KeyFactory keyFactory = KeyFactory.getInstance("RSA");

			Key strkey = null;
			if (mode != type) { // 生成公钥
				KeySpec keySpec = new X509EncodedKeySpec(Tool.str2bytes(key)); // X.509编码
				strkey = keyFactory.generatePublic(keySpec);
			} else { // 生成私钥
				KeySpec keySpec = new PKCS8EncodedKeySpec(Tool.str2bytes(key)); // PKCS#8编码
				strkey = keyFactory.generatePrivate(keySpec);
			}

			// 获得一个RSA的Cipher类，使用私钥加密
			Cipher cipher = Cipher.getInstance("RSA"); // RSA/ECB/PKCS1Padding

			// 初始化
			cipher.init(opmode, strkey);

			// 返回加解密结果
			return byteToHex(cipher.doFinal(str2bytes(data)));// 开始计算
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		return null;
	}

	/**
	 * 生成带SHA-1摘要的RSA签名
	 *
	 * @param N
	 *            RSA的模modulus
	 * @param D
	 *            RSA私钥的指数exponent
	 * @param data
	 *            输入数据
	 * @return 签名后的数据 为null表示操作失败
	 */
	public static String generateSHA1withRSA(String N, String D, String data) {
		try {
			KeyFactory keyFactory = KeyFactory.getInstance("RSA");
			BigInteger big_N = new BigInteger(N);
			BigInteger big_D = new BigInteger(D);
			KeySpec keySpec = new RSAPrivateKeySpec(big_N, big_D);
			PrivateKey key = keyFactory.generatePrivate(keySpec);

			// 使用私钥签名
			Signature sig = Signature.getInstance("SHA1WithRSA"); // SHA1WithRSA
			sig.initSign(key);
			sig.update(str2bytes(data));

			// 返回加密结果
			return byteToHex(sig.sign());// 开始计算
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		return null;
	}

	/**
	 * 验证带SHA-1摘要的RSA签名
	 *
	 * @param N
	 *            RSA的模modulus
	 * @param E
	 *            RSA公钥的指数exponent
	 * @param plaindata
	 *            原始数据
	 * @param signdata
	 *            签名数据
	 * @return 验证结果 true 验证成功 false 验证失败
	 */
	public static boolean verifySHA1withRSA(String N, String E, String plaindata, String signdata) {
		try {
			KeyFactory keyFactory = KeyFactory.getInstance("RSA");
			BigInteger big_N = new BigInteger(N);
			BigInteger big_E = new BigInteger(E);
			KeySpec keySpec = new RSAPublicKeySpec(big_N, big_E);
			PublicKey key = keyFactory.generatePublic(keySpec);

			// 使用公钥验证
			Signature sig = Signature.getInstance("SHA1WithRSA"); // SHA1WithRSA
			sig.initVerify(key);
			sig.update(str2bytes(plaindata));

			// 返回验证结果
			return sig.verify(str2bytes(signdata));
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		return false;
	}

	/**
	 * 生成带SHA-1摘要的RSA签名
	 *
	 * @param key
	 *            DAP或者Token私钥 用PKCS#8编码
	 * @param data
	 *            要签名的原始数据
	 * @return 签名后的数据 为null表示操作失败
	 */
	public static String generateSHA1withRSA(String key, String data) {
		try {
			KeyFactory keyFactory = KeyFactory.getInstance("RSA");
			KeySpec keySpec = new PKCS8EncodedKeySpec(str2bytes(key)); // PKCS#8编码
			PrivateKey privateKey = keyFactory.generatePrivate(keySpec);

			// 使用私钥签名
			Signature sig = Signature.getInstance("SHA1WithRSA"); // SHA1WithRSA
			sig.initSign(privateKey);
			sig.update(str2bytes(data));

			// 返回加密结果
			return byteToHex(sig.sign());// 开始计算
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		return null;
	}

	/**
	 * 验证带SHA-1摘要的RSA签名
	 *
	 * @param key
	 *            Receipt公钥 用X.509编码
	 * @param plaindata
	 *            原始数据
	 * @param signdata
	 *            签名数据
	 * @return 验证结果 true 验证成功 false 验证失败
	 */
	public static boolean verifySHA1withRSA(String key, String plaindata, String signdata) {
		try {
			KeyFactory keyFactory = KeyFactory.getInstance("RSA");
			KeySpec keySpec = new X509EncodedKeySpec(Tool.str2bytes(key)); // X.509编码
			PublicKey publicKey = keyFactory.generatePublic(keySpec);

			// 使用公钥验证
			Signature sig = Signature.getInstance("SHA1WithRSA"); // SHA1WithRSA
			sig.initVerify(publicKey);
			sig.update(str2bytes(plaindata));

			// 返回验证结果
			return sig.verify(str2bytes(signdata));
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		return false;
	}

	/**
	 * DAP计算，函数先对LOAD FILE(C4后面的不包括长度)计算hash(调用generateSHA1函数),所得结果20字节，
	 * 这个值可以放入install for load的HASH字段，再用DAP密钥对上一步的HASH内容进行Single DES Plus Final
	 * Triple DES算法(调用generateMAC函数) 或者RSA
	 * SSA-PKCS1-v1_5算法(调用generateSHA1withRSA函数),计算DAP。
	 *
	 * @param key
	 *            算法1：DAP密钥 16字节 算法2：DAP私钥 用PKCS#8编码
	 * @param data
	 *            要计算的数据（C4后面的不包括长度）
	 * @param algorithm
	 *            要进行计算的算法 1：Single DES Plus Final Triple DES MAC(调用generateMAC)
	 *            2：RSA SSA-PKCS1-v1_5(调用generateSHA1withRSA)
	 * @return DAP数据 为null表示操作失败
	 */
	public static String generateDAP(String key, String data, int algorithm) {
		return (algorithm == 2) ? generateSHA1withRSA(key, generateSHA1(data)) : generateMAC(key, generateSHA1(data),
				"0000000000000000", 2, 2);
	}

	/**
	 * 生成密钥校验值。密钥校验值的计算采用3DES-ECB算法， 以16Bytes密钥对数据“0x00 00 00 00 00 00 00
	 * 00”进行加密操作，并左取计算结果的outlength字节作为密钥校验值
	 *
	 * @param key
	 *            待校验密钥 暂时固定为16字节
	 * @param outlength
	 *            返回的校验值字节长度 一般为3字节
	 * @return 密钥校验值 为null表示操作失败
	 */
	public static String generateKeyCheck(String key, int outlength) {
		try {
			String dataTemp = desecb(key, "0000000000000000", 0);
			if (dataTemp.length() >= outlength * 2) {
				return dataTemp.substring(0, outlength * 2);
			}
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		return null;
	}

	/**
	 * 将整数转换为规定长度的字符串
	 *
	 * @param i
	 *            整数
	 * @param len
	 *            装换字符串的长度
	 * @return
	 */
	public static String int2String(int i, int len) {
		String ret = String.valueOf(i);
		while (ret.length() < len) {
			ret = "0" + ret;
		}
		return ret;
	}

	/**
	 * 将字符串转换为规定长度的16进制字符串 例如：输入："123",8,"20" 输出"31323320"
	 *
	 * @param str
	 *            字符串
	 * @param len
	 *            转换字符串的长度
	 * @param t
	 *            补齐方式 r:右补齐 l:左补齐
	 * @param temp 补位元素
	 * @return
	 */
	public static String str2asc(String str, int len, String t, String temp) {
		String ret = byteToHex(str.getBytes());
		if (t.equals("l")) {
			while (ret.length() < len) {
				ret = temp + ret;
			}
		} else {
			while (ret.length() < len) {
				ret = ret + temp;
			}
		}
		return ret;
	}


	/**
	 * @param by
	 *            将byte数组一个字节一个字节做异或和
	 * @return 一个字节 16进制表示
	 */
	public static String byteyihuohe(byte[] by) {
		byte sum = 0;
		for (int i = 0; i < by.length; i++) {
			sum = (byte) ((sum ^ by[i]) & 0xff);
		}
		String temp = Integer.toHexString(sum).toUpperCase();
		if (temp.length() == 1) {
			temp = "0" + temp;
		} else if (temp.length() == 2) {

		} else {
			temp = temp.substring(temp.length() - 2, temp.length());
		}
		return temp;
	}

	/**
	 * @param F3
	 *            F3域内容拼装
	 * @return
	 */
	public static String add4byte(String F3) {
		String sb = F3;
		while (sb.length() < 8) {
			sb = "0" + sb;
		}
		return sb;
	}

	public static String add00(String F4) {// F4域 16进制字符串
		String add = F4;
		while (add.length() % 16 != 0) {
			add = add + "00";
		}
		System.out.println(add.length() + "===" + add.length() % 16);
		return add;
	}

	/**
	 * @param length
	 *            所需随机数长度
	 * @return 随机数
	 */
	public static String createRandomNum(int length) {
		String allChar = "0123456789";// 只包含数字
		StringBuffer sb = new StringBuffer();
		Random random = new Random();
		for (int i = 0; i < length; i++) {
			sb.append(allChar.charAt(random.nextInt(allChar.length())));
		}
		return sb.toString();
	}

	/**
	 * 异或
	 *
	 * @param op1
	 * @param op2
	 * @return
	 */
	public static byte[] xor(byte[] op1, byte[] op2) {
		int len = op1.length;
		byte[] out = new byte[len];
		for (int i = 0; i < len; i++) {
			out[i] = (byte) (op1[i] ^ op2[i]);
		}
		return out;
	}

	/**
	 * 计算字节校验和
	 *
	 * @param input
	 * @return
	 */
	public static byte calcLRC(byte[] input) {
		byte ret = 0;
		for (int i = 0; i < input.length; i++) {
			ret ^= input[i];
		}
		return ret;
	}
}
