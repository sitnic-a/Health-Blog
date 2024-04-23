using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MentalHealthBlogAPI.Migrations
{
    /// <inheritdoc />
    public partial class FieldCreatedAtDateTimePost : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2024, 4, 23, 13, 2, 55, 936, DateTimeKind.Local).AddTicks(5212));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2024, 4, 23, 13, 2, 55, 936, DateTimeKind.Local).AddTicks(5266));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2024, 4, 23, 13, 2, 55, 936, DateTimeKind.Local).AddTicks(5271));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2024, 4, 23, 13, 2, 55, 936, DateTimeKind.Local).AddTicks(5275));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2024, 4, 23, 13, 2, 55, 936, DateTimeKind.Local).AddTicks(5279));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Posts");
        }
    }
}
