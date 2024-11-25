using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MentalHealthBlogAPI.Migrations
{
    /// <inheritdoc />
    public partial class CascadeDeleteSharesPosts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2024, 11, 25, 13, 45, 39, 460, DateTimeKind.Local).AddTicks(3594));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2024, 11, 25, 13, 45, 39, 460, DateTimeKind.Local).AddTicks(3651));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2024, 11, 25, 13, 45, 39, 460, DateTimeKind.Local).AddTicks(3652));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2024, 11, 25, 13, 45, 39, 460, DateTimeKind.Local).AddTicks(3654));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2024, 11, 25, 13, 45, 39, 460, DateTimeKind.Local).AddTicks(3655));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2024, 10, 26, 17, 59, 54, 76, DateTimeKind.Local).AddTicks(7789));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2024, 10, 26, 17, 59, 54, 76, DateTimeKind.Local).AddTicks(7956));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2024, 10, 26, 17, 59, 54, 76, DateTimeKind.Local).AddTicks(7961));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2024, 10, 26, 17, 59, 54, 76, DateTimeKind.Local).AddTicks(7965));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2024, 10, 26, 17, 59, 54, 76, DateTimeKind.Local).AddTicks(7972));
        }
    }
}
