using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MentalHealthBlogAPI.Migrations
{
    /// <inheritdoc />
    public partial class RemovedRelationWithUserTableMentalHealthExperts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MentalHealthExperts_Users_UserId",
                table: "MentalHealthExperts");

            migrationBuilder.DropForeignKey(
                name: "FK_Shares_Users_SharedWithId",
                table: "Shares");

            migrationBuilder.DropIndex(
                name: "IX_MentalHealthExperts_UserId",
                table: "MentalHealthExperts");

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 5, 25, 11, 34, 1, 778, DateTimeKind.Local).AddTicks(7018));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 5, 25, 11, 34, 1, 778, DateTimeKind.Local).AddTicks(7070));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 5, 25, 11, 34, 1, 778, DateTimeKind.Local).AddTicks(7073));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 5, 25, 11, 34, 1, 778, DateTimeKind.Local).AddTicks(7076));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2025, 5, 25, 11, 34, 1, 778, DateTimeKind.Local).AddTicks(7078));

            migrationBuilder.AddForeignKey(
                name: "FK_Shares_MentalHealthExperts_SharedWithId",
                table: "Shares",
                column: "SharedWithId",
                principalTable: "MentalHealthExperts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
                );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Shares_MentalHealthExperts_SharedWithId",
                table: "Shares");

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
                name: "IX_MentalHealthExperts_UserId",
                table: "MentalHealthExperts",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_MentalHealthExperts_Users_UserId",
                table: "MentalHealthExperts",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Shares_Users_SharedWithId",
                table: "Shares",
                column: "SharedWithId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
