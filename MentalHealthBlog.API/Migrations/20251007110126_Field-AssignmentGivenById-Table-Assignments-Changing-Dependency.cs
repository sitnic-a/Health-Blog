using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MentalHealthBlog.API.Migrations
{
    /// <inheritdoc />
    public partial class FieldAssignmentGivenByIdTableAssignmentsChangingDependency : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Assignments_MentalHealthExperts_AssignmentGivenById",
                table: "Assignments");

            migrationBuilder.DropIndex(
                name: "IX_Assignments_AssignmentGivenById",
                table: "Assignments");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Assignments_AssignmentGivenById",
                table: "Assignments",
                column: "AssignmentGivenById");

            migrationBuilder.AddForeignKey(
                name: "FK_Assignments_MentalHealthExperts_AssignmentGivenById",
                table: "Assignments",
                column: "AssignmentGivenById",
                principalTable: "MentalHealthExperts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
