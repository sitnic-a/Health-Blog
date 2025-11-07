using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MentalHealthBlog.API.Migrations
{
    /// <inheritdoc />
    public partial class AddedFieldIsInformedAboutSubscriptionExpirationTableMentalHealthExpertsRegularUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "RegisteredAt",
                table: "RegularUsers",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2025, 11, 7, 15, 52, 2, 119, DateTimeKind.Utc).AddTicks(6164),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2025, 11, 3, 21, 0, 16, 151, DateTimeKind.Utc).AddTicks(3981));

            migrationBuilder.AddColumn<bool>(
                name: "IsInformedAboutSubscriptionExpiration",
                table: "RegularUsers",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<DateTime>(
                name: "RegisteredAt",
                table: "MentalHealthExperts",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2025, 11, 7, 15, 52, 2, 119, DateTimeKind.Utc).AddTicks(6164),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2025, 11, 3, 21, 0, 16, 151, DateTimeKind.Utc).AddTicks(3981));

            migrationBuilder.AddColumn<bool>(
                name: "IsInformedAboutSubscriptionExpiration",
                table: "MentalHealthExperts",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsInformedAboutSubscriptionExpiration",
                table: "RegularUsers");

            migrationBuilder.DropColumn(
                name: "IsInformedAboutSubscriptionExpiration",
                table: "MentalHealthExperts");

            migrationBuilder.AlterColumn<DateTime>(
                name: "RegisteredAt",
                table: "RegularUsers",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2025, 11, 3, 21, 0, 16, 151, DateTimeKind.Utc).AddTicks(3981),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2025, 11, 7, 15, 52, 2, 119, DateTimeKind.Utc).AddTicks(6164));

            migrationBuilder.AlterColumn<DateTime>(
                name: "RegisteredAt",
                table: "MentalHealthExperts",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2025, 11, 3, 21, 0, 16, 151, DateTimeKind.Utc).AddTicks(3981),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2025, 11, 7, 15, 52, 2, 119, DateTimeKind.Utc).AddTicks(6164));
        }
    }
}
