/**
 * 合并姓氏和名字
 * @param firstName 名字
 * @param lastName 姓氏
 * @returns 返回合并后的完整姓名，格式为"名字 姓氏"
 */
export const mergeName = (firstName: string, lastName: string) => {
  return firstName + " " + lastName;
};