using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MentalHealthBlogAPI.Migrations
{
    /// <inheritdoc />
    public partial class NullableSharedWithIdTableShares : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Shares_Users_SharedWithId",
                table: "Shares");

            migrationBuilder.AlterColumn<int>(
                name: "SharedWithId",
                table: "Shares",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2024, 12, 10, 15, 17, 37, 387, DateTimeKind.Local).AddTicks(5006));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2024, 12, 10, 15, 17, 37, 387, DateTimeKind.Local).AddTicks(5055));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2024, 12, 10, 15, 17, 37, 387, DateTimeKind.Local).AddTicks(5056));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2024, 12, 10, 15, 17, 37, 387, DateTimeKind.Local).AddTicks(5058));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2024, 12, 10, 15, 17, 37, 387, DateTimeKind.Local).AddTicks(5059));

            migrationBuilder.AddForeignKey(
                name: "FK_Shares_Users_SharedWithId",
                table: "Shares",
                column: "SharedWithId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Shares_Users_SharedWithId",
                table: "Shares");

            migrationBuilder.AlterColumn<int>(
                name: "SharedWithId",
                table: "Shares",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

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

            migrationBuilder.AddForeignKey(
                name: "FK_Shares_Users_SharedWithId",
                table: "Shares",
                column: "SharedWithId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
