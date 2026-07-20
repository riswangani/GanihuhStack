using FluentValidation.TestHelper;
using GanihuhStack.Application.Projects.Commands.CreateProject;
using NUnit.Framework;

namespace GanihuhStack.Application.UnitTests.Projects;

[TestFixture]
public class CreateProjectCommandValidatorTests
{
    private CreateProjectCommandValidator _validator = null!;

    [SetUp]
    public void SetUp()
    {
        _validator = new CreateProjectCommandValidator();
    }

    [Test]
    public void Should_HaveError_When_NameIsEmpty()
    {
        var command = new CreateProjectCommand
        {
            Name = string.Empty,
            Description = "Test description"
        };

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(c => c.Name);
    }

    [Test]
    public void Should_HaveError_When_NameExceeds200Characters()
    {
        var command = new CreateProjectCommand
        {
            Name = new string('A', 201),
            Description = "Test description"
        };

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(c => c.Name);
    }

    [Test]
    public void Should_NotHaveError_When_CommandIsValid()
    {
        var command = new CreateProjectCommand
        {
            Name = "Valid Project",
            Description = "Valid Description",
            Technologies = "React, C#",
            RepositoryUrl = "https://github.com/test/project",
            DemoUrl = "https://test.com"
        };

        var result = _validator.TestValidate(command);

        result.ShouldNotHaveAnyValidationErrors();
    }
}
