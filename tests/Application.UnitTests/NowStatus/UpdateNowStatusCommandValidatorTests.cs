using FluentValidation.TestHelper;
using GanihuhStack.Application.NowStatuses.Commands.UpdateNowStatus;
using NUnit.Framework;

namespace GanihuhStack.Application.UnitTests.NowStatus;

[TestFixture]
public class UpdateNowStatusCommandValidatorTests
{
    private UpdateNowStatusCommandValidator _validator = null!;

    [SetUp]
    public void SetUp()
    {
        _validator = new UpdateNowStatusCommandValidator();
    }

    [Test]
    public void Should_HaveError_When_CurrentFocusIsEmpty()
    {
        var command = new UpdateNowStatusCommand
        {
            CurrentFocus = string.Empty
        };

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(c => c.CurrentFocus);
    }

    [Test]
    public void Should_HaveError_When_CurrentFocusExceeds300Characters()
    {
        var command = new UpdateNowStatusCommand
        {
            CurrentFocus = new string('A', 301)
        };

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(c => c.CurrentFocus);
    }

    [Test]
    public void Should_NotHaveError_When_CommandIsValid()
    {
        var command = new UpdateNowStatusCommand
        {
            CurrentFocus = "Building GanihuhStack auth and unit tests",
            Details = "Adding unit and functional test coverage",
            CurrentlyReading = "Clean Code",
            Mood = "Productive"
        };

        var result = _validator.TestValidate(command);

        result.ShouldNotHaveAnyValidationErrors();
    }
}
