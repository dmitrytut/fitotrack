using System;
using System.Net.Mail;
using System.Text.RegularExpressions;
using System.Net;
using System.Net.Sockets;

namespace fitotrack.App_Code.Mail
{
	#region __Класс работы с почтой MailOperate__
	public static class MailOperate
	{
		#region __Строковые константы класса__
		private const string SmtpCientString = "smtp.gmail.com";
		private const string FromMailAddressString = "mypobbed@gmail.com";
		private const string NetworkCredentialUserString = "mypobbed@gmail.com";
		private const string NetworkCredentialPasswordString = "5t(O6y*I5t(O6y*I";
		#endregion

		#region __Методы класса__
		#region __Метод отправки письма SendMailToAddress__
		private static bool SendMailToAddress(string receiveAddress, string subject, string body)
		{
			try
			{
				var mail = new MailMessage();
				var smtpServer = new SmtpClient(SmtpCientString);
				mail.From = new MailAddress(FromMailAddressString);
				mail.To.Add(receiveAddress);
				mail.Subject = subject;
				mail.Body = body;
				smtpServer.Port = 587;
				smtpServer.Credentials = new System.Net.NetworkCredential(NetworkCredentialUserString, NetworkCredentialPasswordString);
				smtpServer.EnableSsl = true;
				smtpServer.Send(mail);
				return true;
			}
			catch
			{
				return false;
			}
		}
		#endregion

		#region __Метод отправки логина и пароля по почте SendCredentialData__
		public static bool SendCredentialData(string receiveAddress, string password, string name)
		{
			const string messageSublect = "Fitotrack Registration";
			string messageBody = "Hello ," + name + "!\r\nThank you for registrate on our site!\r\nYour Password: " + password + "\r\nHope we see you soon!\r\nFitoTrack.com.";
			return SendMailToAddress(receiveAddress, messageSublect, messageBody);
		}
		#endregion

		#region __Метод отправки логина и пароля по почте в случае их утери SendCredentialData__
		public static bool SendRemindCredentialData(string receiveAddress, string password, string name)
		{
			const string messageSublect = "Fitotrack Remind";
			string messageBody = "Hello ," + name + "!\r\nIt looks like you forgot your logun and password.\r\nYour new password: " + password + "\r\nBe carefull next time. Hope we see you soon!\r\nFitoTrack.com.";
			return SendMailToAddress(receiveAddress, messageSublect, messageBody);
		}
		#endregion

		#region __Метод проверки правильноссти email адреса IsEmailValid__
		public static bool IsEmailValid(string inputEmail)
		{
			var regEx = new Regex(@"^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$", RegexOptions.IgnoreCase);
			return regEx.IsMatch(inputEmail);
		}
		#endregion

		#region __Метод проверки сущесствования почтового домена IsRealDomain__
		public static bool IsRealDomain(string inputEmail)
		{
			bool isReal = false;
			try
			{
				string[] host = (inputEmail.Split('@'));
				string hostname = host[1];

				var ipHost = Dns.GetHostEntry(hostname);
				var endPoint = new IPEndPoint(ipHost.AddressList[0], 25);
				var socket = new Socket ( endPoint.AddressFamily,
				        SocketType.Stream, ProtocolType.Tcp );
				socket.Connect ( endPoint );
				socket.Close ( );
				isReal = true;
			}
			catch
			{
			}
			return isReal;
		}
		#endregion

		#endregion
	}
	#endregion
}