using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MentalHealthBlogAPI.Migrations
{
    /// <inheritdoc />
    public partial class TableTherapyRequests : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TherapyRequests",
                columns: table => new
                {
                    RegularUserId = table.Column<int>(type: "int", nullable: false),
                    MentalHealthExpertId = table.Column<int>(type: "int", nullable: false),
                    RequestStatus = table.Column<int>(type: "int", nullable: false),
                    SentAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TherapyRequests", x => new { x.RegularUserId, x.MentalHealthExpertId });
                    table.ForeignKey(
                        name: "FK_TherapyRequests_MentalHealthExperts_MentalHealthExpertId",
                        column: x => x.MentalHealthExpertId,
                        principalTable: "MentalHealthExperts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TherapyRequests_RegularUsers_RegularUserId",
                        column: x => x.RegularUserId,
                        principalTable: "RegularUsers",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 18, 17, 40, 35, 739, DateTimeKind.Local).AddTicks(3745));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 18, 17, 40, 35, 739, DateTimeKind.Local).AddTicks(3803));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 18, 17, 40, 35, 739, DateTimeKind.Local).AddTicks(3805));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 18, 17, 40, 35, 739, DateTimeKind.Local).AddTicks(3806));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 18, 17, 40, 35, 739, DateTimeKind.Local).AddTicks(3808));

            migrationBuilder.CreateIndex(
                name: "IX_TherapyRequests_MentalHealthExpertId",
                table: "TherapyRequests",
                column: "MentalHealthExpertId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TherapyRequests");

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 18, 16, 44, 2, 813, DateTimeKind.Local).AddTicks(5215));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 18, 16, 44, 2, 813, DateTimeKind.Local).AddTicks(5274));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 18, 16, 44, 2, 813, DateTimeKind.Local).AddTicks(5275));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 18, 16, 44, 2, 813, DateTimeKind.Local).AddTicks(5277));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 18, 16, 44, 2, 813, DateTimeKind.Local).AddTicks(5278));
        }
    }
}
