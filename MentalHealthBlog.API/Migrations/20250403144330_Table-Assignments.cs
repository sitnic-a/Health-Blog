using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MentalHealthBlogAPI.Migrations
{
    /// <inheritdoc />
    public partial class TableAssignments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Assignments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AssignmentGivenToId = table.Column<int>(type: "int", nullable: false),
                    AssignmentGivenById = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Assignments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Assignments_MentalHealthExperts_AssignmentGivenById",
                        column: x => x.AssignmentGivenById,
                        principalTable: "MentalHealthExperts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Assignments_Users_AssignmentGivenToId",
                        column: x => x.AssignmentGivenToId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 3, 16, 43, 30, 682, DateTimeKind.Local).AddTicks(6136));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 3, 16, 43, 30, 682, DateTimeKind.Local).AddTicks(6198));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 3, 16, 43, 30, 682, DateTimeKind.Local).AddTicks(6200));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 3, 16, 43, 30, 682, DateTimeKind.Local).AddTicks(6202));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 3, 16, 43, 30, 682, DateTimeKind.Local).AddTicks(6204));

            migrationBuilder.CreateIndex(
                name: "IX_Assignments_AssignmentGivenById",
                table: "Assignments",
                column: "AssignmentGivenById");

            migrationBuilder.CreateIndex(
                name: "IX_Assignments_AssignmentGivenToId",
                table: "Assignments",
                column: "AssignmentGivenToId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Assignments");

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 1, 13, 55, 26, 35, DateTimeKind.Local).AddTicks(4829));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 1, 13, 55, 26, 35, DateTimeKind.Local).AddTicks(4877));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 1, 13, 55, 26, 35, DateTimeKind.Local).AddTicks(4879));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 1, 13, 55, 26, 35, DateTimeKind.Local).AddTicks(4882));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 1, 13, 55, 26, 35, DateTimeKind.Local).AddTicks(4884));
        }
    }
}
