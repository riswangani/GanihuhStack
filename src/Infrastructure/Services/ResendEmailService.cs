using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using GanihuhStack.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace GanihuhStack.Infrastructure.Services;

public class ResendEmailService : IEmailService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<ResendEmailService> _logger;

    public ResendEmailService(
        HttpClient httpClient,
        IConfiguration configuration,
        ILogger<ResendEmailService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendEmailAsync(string to, string subject, string bodyHtml)
    {
        var apiKey = _configuration["Resend:ApiKey"];
        var fromEmail = _configuration["Resend:FromEmail"] ?? "onboarding@resend.dev";

        if (string.IsNullOrEmpty(apiKey))
        {
            _logger.LogWarning("Resend API Key is missing in appsettings.json. Skipping email dispatch.");
            return;
        }

        var requestMessage = new HttpRequestMessage(HttpMethod.Post, "https://api.resend.com/emails");
        requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

        var payload = new
        {
            from = fromEmail,
            to = new[] { to },
            subject,
            html = bodyHtml
        };

        var json = JsonSerializer.Serialize(payload);
        requestMessage.Content = new StringContent(json, Encoding.UTF8, "application.json");

        try
        {
            var response = await _httpClient.SendAsync(requestMessage);
            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("Email successfully sent via Resend to {To}", to);
            }
            else
            {
                var errorResponse = await response.Content.ReadAsStringAsync();
                _logger.LogError("Failed to send email via Resend: {StatusCode} {Error}", response.StatusCode, errorResponse);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while sending email via Resend to {To}", to);
        }
    }
}
