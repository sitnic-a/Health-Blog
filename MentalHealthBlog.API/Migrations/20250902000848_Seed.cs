using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace MentalHealthBlog.API.Migrations
{
    /// <inheritdoc />
    public partial class Seed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "PasswordHash", "PasswordSalt", "Username" },
                values: new object[,]
                {
                    { 1, "TT1", new byte[] { 83, 101, 116, 66, 121, 116, 101, 115, 95, 84, 84, 49 }, "test_01" },
                    { 2, "TT2", new byte[] { 83, 101, 116, 66, 121, 116, 101, 115, 95, 84, 84, 50 }, "test_02" },
                    { 3, "TT3", new byte[] { 83, 101, 116, 66, 121, 116, 101, 115, 95, 84, 84, 51 }, "test_03" },
                    { 4, "TT4", new byte[] { 83, 101, 116, 66, 121, 116, 101, 115, 95, 84, 84, 52 }, "test_04" }
                });
        }
    }
}
