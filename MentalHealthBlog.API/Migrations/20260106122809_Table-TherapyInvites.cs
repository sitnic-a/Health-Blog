using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MentalHealthBlog.API.Migrations
{
    /// <inheritdoc />
    public partial class TableTherapyInvites : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "RegisteredAt",
                table: "RegularUsers",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2026, 1, 6, 12, 28, 9, 813, DateTimeKind.Utc).AddTicks(6049),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2025, 12, 10, 16, 21, 8, 528, DateTimeKind.Utc).AddTicks(3822));

            migrationBuilder.AlterColumn<DateTime>(
                name: "RegisteredAt",
                table: "MentalHealthExperts",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2026, 1, 6, 12, 28, 9, 813, DateTimeKind.Utc).AddTicks(6049),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2025, 12, 10, 16, 21, 8, 528, DateTimeKind.Utc).AddTicks(3822));

            migrationBuilder.CreateTable(
                name: "TherapyInvites",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    MentalHealthExpertId = table.Column<int>(type: "integer", nullable: false),
                    RegularUserId = table.Column<int>(type: "integer", nullable: true),
                    IsRegularUserAlreadyUsingApplication = table.Column<bool>(type: "boolean", nullable: false),
                    InvitedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsUsed = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TherapyInvites", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TherapyInvites");

            migrationBuilder.AlterColumn<DateTime>(
                name: "RegisteredAt",
                table: "RegularUsers",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2025, 12, 10, 16, 21, 8, 528, DateTimeKind.Utc).AddTicks(3822),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2026, 1, 6, 12, 28, 9, 813, DateTimeKind.Utc).AddTicks(6049));

            migrationBuilder.AlterColumn<DateTime>(
                name: "RegisteredAt",
                table: "MentalHealthExperts",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2025, 12, 10, 16, 21, 8, 528, DateTimeKind.Utc).AddTicks(3822),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2026, 1, 6, 12, 28, 9, 813, DateTimeKind.Utc).AddTicks(6049));
        }
    }
}
