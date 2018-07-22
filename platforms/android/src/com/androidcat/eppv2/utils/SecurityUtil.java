package com.androidcat.eppv2.utils;

import java.io.ByteArrayOutputStream;
import java.io.UnsupportedEncodingException;
import java.util.Calendar;
import java.util.Date;
import java.util.Random;
import java.util.TimeZone;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;


public class SecurityUtil {

	private static String[] hexs = new String[] { "0", "1", "2", "3", "4", "5",
		"6", "7", "8", "9", "a", "b", "c", "d", "e", "f" };
	private static String[] bins = new String[] { "0000", "0001", "0010",
		"0011", "0100", "0101", "0110", "0111", "1000", "1001", "1010",
		"1011", "1100", "1101", "1110", "1111" };

	public static String getSubmitTime() {
		Calendar c = Calendar.getInstance(TimeZone.getTimeZone("GMT+8"));
		StringBuffer buffer = new StringBuffer();
		buffer.append(c.get(Calendar.YEAR));
		int t = c.get(Calendar.MONTH) + 1;
		if (t < 10) {
			buffer.append('0');
		}
		buffer.append(t);

		t = c.get(Calendar.DAY_OF_MONTH);
		if (t < 10) {
			buffer.append('0');
		}
		buffer.append(t);
		t = c.get(Calendar.HOUR_OF_DAY);
		if (t < 10) {
			buffer.append('0');
		}
		buffer.append(t);
		t = c.get(Calendar.MINUTE);
		if (t < 10) {
			buffer.append('0');
		}
		buffer.append(t);
		t = c.get(Calendar.SECOND);
		if (t < 10) {
			buffer.append('0');
		}
		buffer.append(t);

		String traceTime = buffer.toString();
		return traceTime;
	}

	/**
	 * 将byte数组转换成16进制组成的字符串 例如 一个byte数组 b[0]=0x07;b[1]=0x10;...b[5]=0xFB;
	 * byte2hex(b); 将返回一个字符串"0710BE8716FB"
	 *
	 * @param bytes
	 *            待转换的byte数组
	 * @return
	 */
	public static String bytesToHexString(byte[] bytes) {
		if (bytes == null) {
			return "";
		}
		StringBuffer buff = new StringBuffer();
		int len = bytes.length;
		for (int j = 0; j < len; j++) {
			if ((bytes[j] & 0xff) < 16) {
				buff.append('0');
			}
			buff.append(Integer.toHexString(bytes[j] & 0xff));
		}
		return buff.toString();
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

	 /**
     * 将整数转�?6进行数后并以指定长度返回（当实际长度大于指定长度时只返回从末位开始指定长度的值）
     *
     * @param val int 待转换整�?
     * @param len int 指定长度
     * @return String
     */
    public static String Int2HexStr(int val, int len) {
        String result = Integer.toHexString(val).toUpperCase();
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
     * 生成16位的动�?链接库鉴权十六进制随机数字符�?
     *
     * @return String
     */
    public static String yieldHexRand() {
        StringBuffer strBufHexRand = new StringBuffer();
        Random rand = new Random(System.currentTimeMillis());
        int index;
        // 随机数字�?
        char charArrayHexNum[] = {'1', '2', '3', '4', '5', '6', '7', '8', '9',
                '0', 'A', 'B', 'C', 'D', 'E', 'F'};
        for (int i = 0; i < 16; i++) {
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

	// 将十六进制数hex转换为二进制数并返回
		public static String convertHexToBin(String hex) {
			StringBuffer buff = new StringBuffer();
			int i;
			for (i = 0; i < hex.length(); i++) {
				buff.append(getBin(hex.substring(i, i + 1)));
			}
			return buff.toString();
		}

		// 返回十六进制数的二进制形式
		private static String getBin(String hex) {
			int i;
			for (i = 0; i < hexs.length && !hex.toLowerCase().equals(hexs[i]); i++)
				;
			return bins[i];
		}

	/**
	 * HEX编码 将形如0x12 0x2A 0x01 转换为122A01
	 *
	 * @param data
	 * @return
	 */
	public static String hexEncode(byte[] data) {
		StringBuffer buffer = new StringBuffer();
		for (int i = 0; i < data.length; i++) {
			String tmp = Integer.toHexString(data[i] & 0xff);
			if (tmp.length() < 2) {
				buffer.append('0');
			}
			buffer.append(tmp);
		}
		String retStr = buffer.toString().toUpperCase();
		return retStr;
	}

	/**
	 * HEX解码 将形如122A01 转换为0x12 0x2A 0x01
	 *
	 * @param data
	 * @return
	 */
	public static byte[] hexDecode(String data) {
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		for (int i = 0; i < data.length(); i += 2) {
			String onebyte = data.substring(i, i + 2);
			int b = Integer.parseInt(onebyte, 16) & 0xff;
			out.write(b);
		}
		return out.toByteArray();
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

	private static String getKeyVersion(String version) {
		StringBuffer sb = new StringBuffer();
		sb.append(version);
		while (sb.length() < 4) {
			sb.insert(0, '0');
		}

		return sb.toString();
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
				// logger.info("Key length is error");
				return null;
			}

			// 初始化
			enc.init(opmode, keySpec);

			// 返回加解密结果
			return (bytesToHexString(enc.doFinal(str2bytes(data)))).toUpperCase();// 开始计算
		} catch (Exception e) {
			// logger.info(e.getMessage());
		}
		return null;
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

	/*
	 * 将16进制数字解码成字符串,适用于所有字符（包括中文）
	 */
	public static String hexStringToString(String bytes) throws UnsupportedEncodingException {
		ByteArrayOutputStream baos = new ByteArrayOutputStream(bytes.length() / 2);
		final String hexString = "0123456789abcdef";
		// 将每2位16进制整数组装成一个字节
		for (int i = 0; i < bytes.length(); i += 2)
			baos.write((hexString.indexOf(bytes.charAt(i)) << 4 | hexString.indexOf(bytes.charAt(i + 1))));
		return new String(baos.toByteArray(), "UTF-8");
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
	 * 该函数具有两个功能： 1.产生一个具有length长度的随机数 2.将该随机数转化为ascii的形式
	 *
	 * @param length
	 * @return ascii字符串
	 */
	public static String generalStringToAscii(int length) {

		int num = 1;
		String strRandom;

		for (int i = 0; i < length; i++) {
			num *= 10;
		}

		try {
			Thread.sleep(10);
			Random rand = new Random((new Date()).getTime());
			strRandom = Integer.toString(rand.nextInt(num));

			int len = strRandom.length();
			for (int i = 0; i < length - len; i++) {
				strRandom = "0" + strRandom;
			}

		} catch (InterruptedException e) {
			strRandom = "00000000";
		}

		StringBuffer sbu = new StringBuffer();
		char[] chars = strRandom.toCharArray();
		for (int i = 0; i < chars.length; i++) {
			sbu.append((int) chars[i]);
		}
		return sbu.toString();
	}


	/*
	 * 将字符串编码成16进制数字,适用于所有字符（包括中文）
	 */
	public static String encodeHexString(String str) {
		// 根据默认编码获取字节数组
		byte[] bytes = str.getBytes();
		final String hexString = "0123456789abcdef";
		StringBuilder sb = new StringBuilder(bytes.length * 2);
		// 将字节数组中每个字节拆解成2位16进制整数
		for (int i = 0; i < bytes.length; i++) {
			sb.append(hexString.charAt((bytes[i] & 0xf0) >> 4));
			sb.append(hexString.charAt((bytes[i] & 0x0f) >> 0));
		}
		return sb.toString();
	}

}
