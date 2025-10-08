using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MentalHealthBlog.API.Migrations
{
    /// <inheritdoc />
    public partial class AddedFieldResponseByIdTableAssignmentResponses : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ResponseById",
                table: "AssignmentResponses",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ResponseById",
                table: "AssignmentResponses");
        }
    }
}
