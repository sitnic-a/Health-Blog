using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace MentalHealthBlog.API.Migrations
{
    /// <inheritdoc />
    public partial class Base_Seed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.InsertData(
                table: "UserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { 1, 1 });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "PasswordHash", "PasswordSalt", "Username" },
                values: new object[] { "924f1831217622ab4ca7182b0ece84bf9dfc6377784940427aa7516e150a33f3d39824ce5255ac1cc1de7f787878f684d9ff1ad82075cb32b0672925e438d407bee627f8faeb9af85012db345260744cf220b9b38faa377d032edcdb15e03fcf4199c44a53203525cac4531a764fdc338b953475e5d1be99a77aeafd6d014688", new byte[] { 11, 103, 90, 24, 44, 184, 41, 36, 244, 177, 219, 200, 216, 124, 58, 125, 235, 196, 254, 157, 199, 113, 131, 136, 27, 52, 33, 193, 20, 137, 4, 90, 8, 222, 47, 177, 27, 18, 77, 21, 22, 89, 124, 180, 237, 221, 92, 54, 93, 182, 20, 192, 45, 150, 173, 197, 14, 228, 43, 105, 127, 1, 41, 55, 37, 21, 98, 108, 143, 46, 88, 143, 200, 114, 208, 46, 243, 38, 181, 85, 104, 74, 204, 87, 233, 32, 241, 162, 148, 102, 186, 120, 110, 169, 75, 160, 229, 31, 239, 14, 22, 199, 33, 98, 82, 244, 176, 153, 60, 56, 65, 10, 129, 8, 153, 26, 96, 216, 223, 46, 153, 148, 8, 182, 98, 44, 229, 168 }, "admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "UserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { 1, 1 });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "PasswordHash", "PasswordSalt", "Username" },
                values: new object[] { "TT1", new byte[] { 83, 101, 116, 66, 121, 116, 101, 115, 95, 84, 84, 49 }, "test_01" });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "PasswordHash", "PasswordSalt", "Username" },
                values: new object[,]
                {
                    { 2, "TT2", new byte[] { 83, 101, 116, 66, 121, 116, 101, 115, 95, 84, 84, 50 }, "test_02" },
                    { 3, "TT3", new byte[] { 83, 101, 116, 66, 121, 116, 101, 115, 95, 84, 84, 51 }, "test_03" },
                    { 4, "TT4", new byte[] { 83, 101, 116, 66, 121, 116, 101, 115, 95, 84, 84, 52 }, "test_04" }
                });
        }
    }
}
