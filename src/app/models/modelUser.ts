export interface modelUser {
    userId: number,
    userNameSurname: string,
    userEmail: string,
    userAbout: string,
    userTel: string,
    userAdress: string,
    userPassword: string
}



// modelBuilder.Entity<User>(entity =>
//     {
//         entity.Property(e => e.UserId)
//             .ValueGeneratedOnAdd()
//             .HasColumnName("userID");
//         entity.Property(e => e.UserAbout)
//             .HasMaxLength(90)
//             .HasColumnName("userAbout");
//         entity.Property(e => e.UserAdress)
//             .HasMaxLength(150)
//             .HasColumnName("userAdress");
//         entity.Property(e => e.UserEmail)
//             .HasMaxLength(70)
//             .HasColumnName("userEmail");
//         entity.Property(e => e.UserNameSurname)
//             .HasMaxLength(30)
//             .HasColumnName("userNameSurname");
//         entity.Property(e => e.UserPassword)
//             .HasMaxLength(10)
//             .IsFixedLength()
//             .HasColumnName("userPassword");
//         entity.Property(e => e.UserTel)
//             .HasMaxLength(10)
//             .IsFixedLength()
//             .HasColumnName("userTel");
//     });













